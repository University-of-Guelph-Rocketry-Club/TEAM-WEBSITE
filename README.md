# University of Guelph Rocketry Club Website

A full-stack web application for the University of Guelph Rocketry Club featuring team management, project tracking, and an AI-powered chatbot assistant.

## 🚀 Features

### Public Features
- **Modern Landing Page**: Attractive homepage with club information
- **Projects Showcase**: Display of past and current rocketry projects
- **Team Information**: Meet the team members and executives
- **Sponsor Recognition**: Showcase club sponsors and partnerships
- **Join Information**: How to get involved with the club

### Member Features (Authentication Required)
- **User Authentication**: Secure login/register system with JWT tokens
- **Team Management**: Create, join, and manage project teams
- **Project Updates**: Teams can log progress and keep members updated
- **Personal Dashboard**: View your teams and recent activities
- **AI Chatbot Assistant**: Get help with rocketry questions and club information

### AI Chatbot
- **Smart Assistant**: OpenAI-powered chatbot with rocketry knowledge
- **Conversation History**: Save and resume conversations
- **Context Aware**: Understands club-specific information and projects
- **24/7 Availability**: Always available to help with questions

## 🛠️ Technology Stack

### Frontend
- **React 18** with Vite for fast development
- **Tailwind CSS** for modern, responsive styling
- **React Router** for client-side routing
- **Axios** for API communication
- **Context API** for state management

### Backend
- **FastAPI** for high-performance Python API
- **SQLAlchemy ORM** for database management
- **JWT Authentication** for secure user sessions
- **OpenAI API** integration for chatbot functionality
- **SQLite** database (easily upgradeable to PostgreSQL)

## 📋 Prerequisites

- **Node.js** (v18 or higher)
- **Python** (3.8 or higher)
- **OpenAI API Key** (for chatbot functionality)

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd rocket-guelph
```

### 2. Backend Setup

#### Navigate to backend directory
```bash
cd backend
```

#### Create virtual environment
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

#### Install dependencies
```bash
pip install -r requirements.txt
```

#### Configure environment variables
```bash
cp .env.example .env
```

Edit `.env` file and add your configuration:
```bash
# Required for authentication
SECRET_KEY=your-super-secret-jwt-key-change-this-in-production
JWT_SECRET_KEY=your-jwt-secret-key-here

# Required for chatbot
OPENAI_API_KEY=your-openai-api-key-here

# Database (default SQLite)
DATABASE_URL=sqlite:///./rocketry.db
```

#### Start the backend server
```bash
cd app
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`
- API Documentation: `http://localhost:8000/docs`

### 3. Frontend Setup

#### Navigate to frontend directory (in new terminal)
```bash
cd frontend
```

#### Install dependencies
```bash
npm install
```

#### Configure environment variables
```bash
cp .env.example .env
```

Edit `.env` file:
```bash
VITE_API_URL=http://localhost:8000/api
```

#### Start the development server
```bash
npm run dev
```

The website will be available at `http://localhost:5173`

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user info
- `PATCH /api/auth/me` - Update user profile

### Team Management
- `GET /api/teams` - List all teams
- `POST /api/teams` - Create new team
- `GET /api/teams/{id}` - Get team details
- `POST /api/teams/{id}/join` - Join a team
- `POST /api/teams/{id}/leave` - Leave a team

### Project Updates
- `GET /api/project-updates` - List all updates
- `POST /api/project-updates` - Create new update
- `GET /api/project-updates/team/{team_id}` - Get team updates
- `GET /api/project-updates/my-updates` - Get user's updates

### Chatbot
- `POST /api/chatbot/chat` - Send message to chatbot
- `GET /api/chatbot/conversations` - List conversations
- `POST /api/chatbot/conversations` - Create conversation
- `GET /api/chatbot/conversations/{id}` - Get conversation details
- `DELETE /api/chatbot/conversations/{id}` - Delete conversation

## 🎯 Usage Guide

### For Club Members

#### Getting Started
1. Visit the website and click "Login" or "Register"
2. Create your account with your university email
3. Explore the dashboard to see available teams

#### Joining Teams
1. Go to "Teams" page from navigation
2. Browse available teams and their projects
3. Click "Join Team" to become a member
4. Start collaborating and posting updates

#### Using Project Updates
1. Navigate to your team's detail page
2. Click "Add Update" to log progress
3. Include update type, description, and any relevant links
4. Team members will see your updates in real-time

#### AI Chatbot Assistant
1. Click the robot icon (🤖) in the bottom-right corner
2. Ask questions about rocketry, club activities, or projects
3. The assistant can help with:
   - Technical rocketry questions
   - Club event information
   - Project guidance and tips
   - General engineering support

### For Team Leaders

#### Creating Teams
1. From the Teams page, click "Create New Team"
2. Provide team name, description, and project details
3. Set team as public or private
4. Invite members or let them join publicly

#### Managing Projects
1. Regularly post project updates to keep team informed
2. Use different update types: progress, milestone, issue, announcement
3. Monitor team member activities and contributions

## 🔧 Development

### Project Structure
```
rocket-guelph/
├── frontend/                 # React frontend application
│   ├── public/              # Static assets
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── contexts/        # React context providers
│   │   ├── lib/            # Utilities and API client
│   │   ├── pages/          # Page components
│   │   └── App.jsx         # Main app component
│   └── package.json
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── routers/        # API route handlers
│   │   ├── models.py       # Database models
│   │   ├── schemas.py      # Pydantic schemas
│   │   ├── auth.py         # Authentication utilities
│   │   └── main.py         # FastAPI app setup
│   └── requirements.txt
└── README.md
```

### API Documentation
The FastAPI backend automatically generates OpenAPI documentation available at:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## 🚀 Deployment

### Backend Deployment
1. Set up production environment variables
2. Use a production WSGI server like Gunicorn:
   ```bash
   gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker
   ```

### Frontend Deployment
1. Build the production bundle:
   ```bash
   npm run build
   ```
2. Deploy the `dist/` folder to your static hosting service

### Environment Variables for Production
```bash
# Backend
DATABASE_URL=postgresql://production_db_url
SECRET_KEY=production-secret-key
OPENAI_API_KEY=your-production-openai-key
ALLOWED_ORIGINS=["https://yourdomain.com"]

# Frontend
VITE_API_URL=https://your-api-domain.com/api
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For technical support or questions about the club:
- Email: [club-email@uoguelph.ca]
- Discord: [Discord Server Link]
- Issues: Open a GitHub issue for bug reports

## 🔮 Future Enhancements

- **Mobile App**: React Native mobile application
- **File Uploads**: Document and image sharing for projects
- **Calendar Integration**: Event scheduling and reminders
- **Advanced Analytics**: Project progress tracking and metrics
- **Email Notifications**: Automated updates and reminders
- **Competition Tracking**: Competition registration and results
- **Resource Library**: Technical documents and tutorials

---

Built with ❤️ by the University of Guelph Rocketry Club

## 🛠️ Technology Stack

### Backend
- **FastAPI** - Modern, fast web framework for APIs
- **SQLAlchemy** - SQL toolkit and ORM
- **SQLite** - Database (easily upgradeable to PostgreSQL)
- **Pydantic** - Data validation using Python type annotations
- **Uvicorn** - ASGI server
- **Python-dotenv** - Environment variable management

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API calls

## 🚀 Quick Start

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd rocket-guelph/backend
   ```

2. **Create and activate virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. **Run the development server:**
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```

The API will be available at `http://localhost:8000`
API documentation at `http://localhost:8000/docs`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd rocket-guelph/frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

The website will be available at `http://localhost:5173`

## 🔧 Configuration

### Backend Environment Variables (.env)

```env
# Database
DATABASE_URL=sqlite:///./rocketry.db

# Security
SECRET_KEY=your-secret-key-here

# Email Configuration (for contact forms)
CONTACT_EMAIL_TO=nick.buzali@gmail.com
CONTACT_EMAIL_FROM=noreply@rocketryguelph.ca
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# Discord (optional)
DISCORD_INVITE_URL=https://discord.gg/rocketryguelph
```

### Frontend Environment Variables

Create `.env` in the frontend directory:

```env
VITE_API_URL=http://localhost:8000/api
```

## 📡 API Endpoints

### Projects
- `GET /api/projects` - List all projects
- `GET /api/projects/{id}` - Get project details
- `POST /api/projects` - Create new project

### News
- `GET /api/news` - List all news articles
- `GET /api/news/{id}` - Get article details
- `POST /api/news` - Create new article

### Team
- `GET /api/execs` - List executive team members
- `GET /api/execs/{id}` - Get executive details
- `POST /api/execs` - Add new executive

### Sponsors
- `GET /api/sponsors` - List all sponsors
- `POST /api/sponsor-inquiries` - Submit sponsor inquiry

### Contact
- `POST /api/contact` - Submit contact form

### Discord
- `GET /api/discord/invite` - Get Discord invite link
- `POST /api/discord/join-request` - Submit join request

## 🎨 Frontend Features

- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Modern UI Components** - Clean, professional design
- **Form Handling** - Contact forms with validation
- **API Integration** - Seamless backend communication
- **Routing** - Multi-page application with React Router

## 🗄️ Database Schema

### Projects
- ID, title, description, image_url, status, created_at

### News Articles
- ID, title, content, image_url, published_at

### Executives
- ID, name, position, bio, image_url, email

### Sponsors
- ID, name, logo_url, website_url, tier

### Sponsor Inquiries
- ID, company_name, contact_name, email, phone, message, created_at, status

### Contact Messages
- ID, name, email, subject, message, created_at, status

## 🚀 Deployment

### Backend Deployment
1. Set up production database (PostgreSQL recommended)
2. Configure production environment variables
3. Deploy to cloud provider (Heroku, DigitalOcean, AWS, etc.)
4. Run database migrations

### Frontend Deployment
1. Build the production bundle: `npm run build`
2. Deploy to static hosting (Netlify, Vercel, GitHub Pages)
3. Configure environment variables for production API URL

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 Development Notes

- The backend automatically creates database tables on first run
- CORS is configured to allow frontend development server access
- Email notifications are sent in the background for contact forms
- All forms include proper validation and error handling
- The project uses modern Python type hints throughout

## 🆘 Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure the frontend URL is in the backend's CORS origins
2. **Database Issues**: Delete the SQLite file to reset the database
3. **Email Not Sending**: Check SMTP configuration in environment variables
4. **Port Conflicts**: Change ports in configuration if already in use

### Getting Help

- Check the API documentation at `http://localhost:8000/docs`
- Review browser console for frontend errors
- Check backend logs for API errors
- Contact the development team: nick.buzali@gmail.com

## 📄 License

This project is developed for the University of Guelph Rocketry Club.

---

**University of Guelph Rocketry Club** - Reaching for the Stars 🚀