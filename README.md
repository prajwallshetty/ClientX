# 🚀 ClientX – Multi-Tenant Project Management System  

**ClientX** is a scalable **multi-tenancy project management system** built with the **MERN stack (MongoDB, Express, React, Node.js)**.  
It’s designed for **real-world B2B collaboration** with features like **Google Sign-In, workspace management, task tracking, role-based permissions, and analytics**.  

Perfect for developers looking to build a **SaaS project management or team collaboration platform**.  

---

## ✨ Features  

- 🔐 **Authentication** – Google OAuth, Email & Password  
- 🏢 **Workspaces** – Create & manage multiple organizations  
- 📊 **Projects & Epics** – Organize work at scale  
- ✅ **Tasks** – CRUD operations with status, priority & assignees  
- 👥 **Roles & Permissions** – Owner, Admin, Member  
- ✉️ **Invitations** – Invite users to join workspaces  
- 🔍 **Filters & Search** – By status, priority, assignee  
- 📈 **Analytics Dashboard** – Team & project insights  
- 📅 **Pagination & Infinite Scroll** – Smooth data loading  
- 🔒 **Secure Sessions** – Cookie-based authentication  
- 🚪 **Logout & Session Termination**  
- 🌱 **Database Seeding** – Sample/test data generation  
- 💾 **Mongoose Transactions** – Reliable data integrity  

---

## 🛠️ Tech Stack  

- **Backend**: Node.js, Express.js, TypeScript  
- **Frontend**: React.js (Vite), TailwindCSS, Shadcn UI  
- **Database**: MongoDB, Mongoose  
- **Auth**: Google OAuth 2.0, Cookie Sessions  
- **Other Tools**:  
  - Vite.js for frontend build  
  - ESLint + Prettier for code quality  

---

## 🔄 Getting Started  

### 1️ Clone the Repository  
```bash
git clone https://github.com/Chethumalli/ClientX.git
cd ClientX

```
### 2 Install Dependencies
```bash
npm install
```
### 3 Configure Environment Variables

Create a .env file in the root and add:

```bash
PORT=8000
NODE_ENV=development
MONGO_URI="mongodb+srv://<username>:<password>@cluster.mongodb.net/teamsync_db"

SESSION_SECRET="your_session_secret"

GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>
GOOGLE_CALLBACK_URL=http://localhost:8000/api/auth/google/callback

FRONTEND_ORIGIN=http://localhost:5173
FRONTEND_GOOGLE_CALLBACK_URL=http://localhost:5173/google/callback
```
### 4 Run the Development Server
```bash
npm run dev
```
Backend runs on: http://localhost:8000

Frontend runs on: http://localhost:5173
