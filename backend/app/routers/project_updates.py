from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..db import get_db
from ..models import ProjectUpdate as ProjectUpdateModel, Project as ProjectModel, Team as TeamModel
from ..schemas import ProjectUpdate, ProjectUpdateCreate
from ..auth import get_current_active_user

router = APIRouter()

@router.get("/", response_model=List[ProjectUpdate])
def get_project_updates(
    project_id: int = None,
    team_id: int = None,
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db)
):
    query = db.query(ProjectUpdateModel)
    
    if project_id:
        query = query.filter(ProjectUpdateModel.project_id == project_id)
    if team_id:
        query = query.filter(ProjectUpdateModel.team_id == team_id)
    
    updates = query.order_by(ProjectUpdateModel.created_at.desc()).offset(skip).limit(limit).all()
    return updates

@router.get("/my-updates", response_model=List[ProjectUpdate])
def get_my_updates(
    current_user = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    # Get updates from user's teams
    user_team_ids = [team.id for team in current_user.teams]
    updates = db.query(ProjectUpdateModel).filter(
        ProjectUpdateModel.team_id.in_(user_team_ids)
    ).order_by(ProjectUpdateModel.created_at.desc()).limit(50).all()
    return updates

@router.get("/{update_id}", response_model=ProjectUpdate)
def get_project_update(update_id: int, db: Session = Depends(get_db)):
    update = db.query(ProjectUpdateModel).filter(ProjectUpdateModel.id == update_id).first()
    if update is None:
        raise HTTPException(status_code=404, detail="Project update not found")
    return update

@router.post("/", response_model=ProjectUpdate)
def create_project_update(
    update: ProjectUpdateCreate,
    current_user = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    # Verify project exists
    project = db.query(ProjectModel).filter(ProjectModel.id == update.project_id).first()
    if project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    
    # Verify user is member of project's team
    if project.team not in current_user.teams:
        raise HTTPException(status_code=403, detail="Not authorized to update this project")
    
    # Create update
    db_update = ProjectUpdateModel(
        **update.dict(),
        team_id=project.team_id,
        author_id=current_user.id
    )
    
    # Update project progress if specified
    if update.progress_change != 0:
        new_progress = max(0, min(100, project.progress_percentage + update.progress_change))
        project.progress_percentage = new_progress
    
    db.add(db_update)
    db.commit()
    db.refresh(db_update)
    return db_update

@router.get("/team/{team_id}", response_model=List[ProjectUpdate])
def get_team_updates(
    team_id: int,
    current_user = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    # Verify user is member of the team
    team = db.query(TeamModel).filter(TeamModel.id == team_id).first()
    if team is None:
        raise HTTPException(status_code=404, detail="Team not found")
    
    if team not in current_user.teams:
        raise HTTPException(status_code=403, detail="Not authorized to view this team's updates")
    
    updates = db.query(ProjectUpdateModel).filter(
        ProjectUpdateModel.team_id == team_id
    ).order_by(ProjectUpdateModel.created_at.desc()).all()
    
    return updates