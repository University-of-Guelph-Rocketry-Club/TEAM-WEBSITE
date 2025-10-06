# University of Guelph Rocketry Club - Complete Tech Stack

## 🚀 Project Overview
Full-stack web application for the University of Guelph Rocketry Club featuring AI-powered chatbot, member management, project showcases, and sponsor integration.

## 🎯 Live Deployment
- **Frontend**: https://demorocketryguelphweb.onrender.com
- **Backend API**: https://demo-rocketry-website.onrender.com
- **Repository**: https://github.com/Nickbravo21/FAKE-WEBSITE

---

## 📱 Frontend Stack

### **Framework & Build Tools**
- **React 18.2.0** - Component-based UI library
- **Vite 4.x** - Fast build tool and dev server
- **JavaScript (ES6+)** - Modern JavaScript features

### **Routing & Navigation**
- **React Router DOM 6.20.1** - Client-side routing

### **Styling & UI**
- **Tailwind CSS 3.x** - Utility-first CSS framework
- **PostCSS** - CSS preprocessing
- **Autoprefixer** - CSS vendor prefixing

### **HTTP Client**
- **Axios 1.6.2** - Promise-based HTTP requests

### **Development Tools**
- **ESLint** - Code linting
- **Vite Dev Server** - Hot module replacement

---

## ⚡ Backend Stack

### **Framework & Runtime**
- **FastAPI** - Modern Python web framework
- **Python 3.12** - Programming language
- **Uvicorn** - ASGI web server
- **Pydantic** - Data validation and serialization

### **Database & ORM**
- **SQLAlchemy** - Python SQL toolkit and ORM
- **SQLite** - Local development database
- **PostgreSQL** - Production database (Render)

### **Authentication & Security**
- **JWT (JSON Web Tokens)** - Stateless authentication
- **Passlib** - Password hashing
- **CORS Middleware** - Cross-origin resource sharing

### **AI & Machine Learning**
- **OpenAI GPT-4o-mini** - Conversational AI chatbot
- **OpenAI DALL-E 3** - AI image generation
- **Custom AI Integration** - Vincent Nicholas Buzali persona

### **Email Services**
- **Gmail SMTP** - Email delivery
- **App Password Authentication** - Secure email access

### **Data Models**
- **User Management** - Registration, authentication
- **Projects** - Showcase rocketry projects
- **News & Updates** - Club announcements
- **Team Management** - Member profiles
- **Sponsors** - Partner organizations
- **Contact Forms** - Inquiry handling
- **Chat Logging** - AI interaction auditing

---

## 🌐 Deployment & Infrastructure

### **Hosting Platform**
- **Render** - Cloud hosting platform
- **Automatic Deployments** - GitHub integration
- **Environment Variables** - Secure configuration

### **CI/CD Pipeline**
- **GitHub Actions** - Automated workflows
- **Git Version Control** - Source code management
- **Branch Strategy** - Feature branches

### **Domain & SSL**
- **HTTPS Encryption** - Secure connections
- **Custom Subdomains** - Professional URLs

---

## 🔧 Development Environment

### **Package Management**
- **npm** - Frontend package manager
- **pip** - Python package manager
- **Virtual Environment** - Python dependency isolation

### **Code Quality**
- **ESLint** - JavaScript linting
- **Prettier** - Code formatting
- **Git Hooks** - Pre-commit checks

### **API Documentation**
- **FastAPI Swagger** - Interactive API docs
- **OpenAPI Specification** - API schema

---

## 🚀 Key Features

### **AI Integration**
- **Conversational Chatbot** - Vincent Nicholas Buzali AI persona
- **Image Generation** - DALL-E 3 integration
- **Smart Response System** - Context-aware interactions
- **Chat Logging** - Security and analytics

### **User Management**
- **Email Registration** - Secure account creation
- **JWT Authentication** - Stateless sessions
- **Role-based Access** - Permission system

### **Content Management**
- **Project Showcases** - Rocketry achievements
- **News System** - Club updates
- **Team Profiles** - Member information
- **Sponsor Directory** - Partner organizations

### **Communication**
- **Contact Forms** - Inquiry handling
- **Email Integration** - Automated responses
- **Discord Integration** - Community linking

---

## 🔐 Security Features

### **Data Protection**
- **Password Hashing** - Secure credential storage
- **JWT Tokens** - Stateless authentication
- **CORS Protection** - Origin validation
- **Input Validation** - Pydantic schemas

### **Chat Security**
- **Session Tracking** - User activity monitoring
- **IP Logging** - Security auditing
- **Content Filtering** - Safe interactions

---

## 📊 Performance Optimizations

### **Frontend**
- **Vite Build Optimization** - Fast bundling
- **Code Splitting** - Lazy loading
- **Asset Optimization** - Image compression

### **Backend**
- **Async Operations** - Non-blocking requests
- **Database Indexing** - Query optimization
- **Connection Pooling** - Efficient DB access

---

## 🔄 API Architecture

### **RESTful Design**
- **Resource-based URLs** - Clean endpoints
- **HTTP Methods** - Semantic operations
- **Status Codes** - Standard responses

### **API Endpoints**
```
GET    /api/projects          # List projects
POST   /api/auth/register     # User registration
POST   /api/chatbot/chat      # AI conversations
GET    /api/news             # Club announcements
POST   /api/contact          # Contact forms
GET    /api/sponsors         # Partner information
```

---

## 🛠️ Development Commands

### **Frontend Development**
```bash
npm install          # Install dependencies
npm run dev          # Start dev server
npm run build        # Production build
npm run preview      # Preview build
npm run serve        # Serve with static server
```

### **Backend Development**
```bash
pip install -r requirements.txt    # Install dependencies
uvicorn app.main:app --reload      # Start dev server
python -m pytest                  # Run tests
```

---

## 📦 Dependencies

### **Frontend Core**
- React, React DOM, React Router
- Vite, Tailwind CSS, Axios
- ESLint, PostCSS, Autoprefixer

### **Backend Core**
- FastAPI, Uvicorn, SQLAlchemy
- OpenAI, Pydantic, Passlib
- Python-multipart, Email-validator

---

## 🌟 Special Features

### **Vincent Nicholas Buzali AI**
- Custom AI personality integration
- Lead software engineer persona
- Rocketry expertise focus
- Interactive image generation

### **Multi-Platform Deployment**
- Render (Primary)
- Railway (Alternative)
- Docker (Containerization)
- DigitalOcean (Backup)

---

## 📈 Future Enhancements

### **Planned Features**
- Real-time notifications
- Advanced analytics
- Mobile app integration
- Enhanced AI capabilities
- Expanded project management

### **Scalability Considerations**
- Microservices architecture
- CDN integration
- Caching strategies
- Load balancing

---

## 👥 Development Team

**Lead Developer**: Vincent Nicholas Buzali (AI Integration Specialist)
**Tech Stack**: Modern full-stack web development
**Focus**: Rocketry club digital transformation

---

*This tech stack represents a modern, scalable, and secure web application built specifically for the University of Guelph Rocketry Club's digital presence and community engagement.*
