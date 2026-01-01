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
- 🤖 **AI Chat Assistant** – Powered by Google Gemini with conversation context
- 💬 **User-Specific Chat History** – Private conversations with database persistence
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
- **AI**: Google Gemini API (gemini-2.0-flash)
- **Other Tools**:  
  - Axios for HTTP requests
  - Vite.js for frontend build  
  - ESLint + Prettier for code quality  

---

## 🔄 Getting Started  

### 1️ Clone the Repository  
```bash
git clone https://github.com/prajwallshetty/ClientX.git
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

GEMINI_API_KEY=your_gemini_api_key_here
```

### 4️⃣ Get Your Gemini API Key (For AI Chat)

1. Visit **https://aistudio.google.com/app/apikey**
2. Sign in with your Google account
3. Click **"Create API key"** → **"Create API key in new project"**
4. Copy the API key and add it to your `.env` file
5. Test your API key (optional):
   ```bash
   cd backend
   node test.js
   ```

### 5️⃣ Run the Development Server
```bash
npm run dev
```
Backend runs on: http://localhost:8000

Frontend runs on: http://localhost:5173

---

## 🤖 AI Chat Feature

The AI Chat Assistant is powered by **Google Gemini 2.0 Flash** and provides intelligent responses with full conversation context.

### 🚀 Quick Setup (3 Simple Steps)

**It's incredibly easy to connect Gemini AI to this project!**

1. **Get Free API Key** (2 minutes)
   - Visit: https://aistudio.google.com/app/apikey
   - Click "Create API key" → "Create API key in new project"
   - Copy your key (looks like: `AIzaSy...`)

2. **Add to .env File** (30 seconds)
   ```bash
   GEMINI_API_KEY=paste_your_key_here
   ```

3. **Restart Server** (Done! ✅)
   ```bash
   npm run dev
   ```

**That's it!** Your AI Chat is now live and ready to use. No complex configuration needed!

### Features
- ✅ **Conversation Context** – AI remembers last 10 messages for follow-up questions
- ✅ **User-Specific History** – Each user has private chat history
- ✅ **Database Persistence** – Chat survives page refreshes
- ✅ **Auto-Scroll** – Smooth scrolling while AI responds
- ✅ **Clear History** – Delete your chat anytime

### How to Use
1. Log in to your account
2. Click **"AI Chat"** in the sidebar
3. Ask any question – programming, general knowledge, advice, etc.
4. AI remembers context, so you can ask follow-up questions!

### API Endpoints
- **POST** `/api/ai/chat` – Send message to AI
- **GET** `/api/ai/chat/history` – Get user's chat history
- **DELETE** `/api/ai/chat/history` – Clear chat history

### Technical Details
- **Model**: gemini-2.0-flash (fast, no thinking tokens)
- **Max Tokens**: 8192 (long detailed responses)
- **Context**: Last 10 messages sent to AI
- **Rate Limits**: 15 req/min, 4M tokens/min (free tier)

### Troubleshooting
- **API Key Issues**: Run `node test.js` in backend folder
- **No Context**: Make sure you're logged in
- **Responses Cut Off**: Increase `maxOutputTokens` in `ai.service.ts`

<iframe style="width:100%;height:auto;min-width:600px;min-height:400px;" src="https://www.star-history.com/embed?secret=#prajwallshetty/ClientX&type=date&legend=top-left" frameBorder="0"></iframe>
---
