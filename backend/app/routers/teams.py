from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..db import get_db
from ..models import Team as TeamModel, User as UserModel, user_team_association
from ..schemas import Team, TeamCreate, User
from ..auth import get_current_active_user, get_admin_user

router = APIRouter()

@router.get("/", response_model=List[Team])
def get_teams(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    teams = db.query(TeamModel).offset(skip).limit(limit).all()
    return teams

@router.get("/my-teams", response_model=List[Team])
def get_my_teams(
    current_user: UserModel = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    return current_user.teams

@router.get("/{team_id}", response_model=Team)
def get_team(team_id: int, db: Session = Depends(get_db)):
    team = db.query(TeamModel).filter(TeamModel.id == team_id).first()
    if team is None:
        raise HTTPException(status_code=404, detail="Team not found")
    return team

@router.post("/", response_model=Team)
def create_team(
    team: TeamCreate, 
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_admin_user)
):
    db_team = TeamModel(**team.dict())
    db.add(db_team)
    db.commit()
    db.refresh(db_team)
    return db_team

@router.post("/{team_id}/join")
def join_team(
    team_id: int,
    current_user: UserModel = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    team = db.query(TeamModel).filter(TeamModel.id == team_id).first()
    if team is None:
        raise HTTPException(status_code=404, detail="Team not found")
    
    if team in current_user.teams:
        raise HTTPException(status_code=400, detail="Already a member of this team")
    
    current_user.teams.append(team)
    db.commit()
    return {"message": "Successfully joined team"}

@router.post("/{team_id}/leave")
def leave_team(
    team_id: int,
    current_user: UserModel = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    team = db.query(TeamModel).filter(TeamModel.id == team_id).first()
    if team is None:
        raise HTTPException(status_code=404, detail="Team not found")
    
    if team not in current_user.teams:
        raise HTTPException(status_code=400, detail="Not a member of this team")
    
    current_user.teams.remove(team)
    db.commit()
    return {"message": "Successfully left team"}

@router.get("/{team_id}/members", response_model=List[User])
def get_team_members(team_id: int, db: Session = Depends(get_db)):
    team = db.query(TeamModel).filter(TeamModel.id == team_id).first()
    if team is None:
        raise HTTPException(status_code=404, detail="Team not found")
    return team.members

@router.post("/{team_id}/add-member/{user_id}")
def add_team_member(
    team_id: int,
    user_id: int,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_admin_user)
):
    team = db.query(TeamModel).filter(TeamModel.id == team_id).first()
    user = db.query(UserModel).filter(UserModel.id == user_id).first()
    
    if team is None:
        raise HTTPException(status_code=404, detail="Team not found")
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    if team in user.teams:
        raise HTTPException(status_code=400, detail="User is already a member of this team")
    
    user.teams.append(team)
    db.commit()
    return {"message": "User added to team successfully"}

@router.delete("/{team_id}/remove-member/{user_id}")
def remove_team_member(
    team_id: int,
    user_id: int,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_admin_user)
):
    team = db.query(TeamModel).filter(TeamModel.id == team_id).first()
    user = db.query(UserModel).filter(UserModel.id == user_id).first()
    
    if team is None:
        raise HTTPException(status_code=404, detail="Team not found")
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    if team not in user.teams:
        raise HTTPException(status_code=400, detail="User is not a member of this team")
    
    user.teams.remove(team)
    db.commit()
    return {"message": "User removed from team successfully"}