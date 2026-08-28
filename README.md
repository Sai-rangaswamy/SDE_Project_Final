# SDE_Project_Final:

So basically this is my readme file and if you read through this file you'll understand what my idea is and what are my intension and i would have been able to build this much more better way if i had used the time more wisely but here we are i have built this.. Thank you for giving me this opp.

The Issue:
  Right now, hardworking blue-collar workers struggle to find consistent jobs, while project owners struggle to find reliable labor. The current ecosystem relies almost entirely on word-of-mouth, paper attendance tracking, and delayed cash payments.

There is a massive gap: there is no central system where a manual laborer's hard work, punctuality, and reliability actually translate into a verified reputation that helps them land their next job.

My Solution:
  I built a triple-sided digital marketplace designed specifically to bring modern SaaS architecture to construction sites. By connecting the top of the chain directly down to the ground force, the platform creates a transparent ecosystem where good work is actually rewarded.

The platform is split into three distinct domains:

1) Corporate : A command center to manage multiple construction sites, track budgets, set up geographical boundaries (geofences) for attendance, and hire vetted Subcontractors based on verified platform history rather than just word-of-mouth.

2) Subcontractors : A management dashboard to apply for Corporate contracts, instantly post daily "Gigs" to hire local manual laborers, and manage crew attendance and wage payouts.

3) Workers: A hyper-simplified, mobile-first interface allowing workers to discover daily wage jobs based on GPS proximity, clock in automatically via site geofencing, and build a verified rating based on their actual reliability and performance.

4) Site Talk : A shared, cross-role forum where workers can warn each other about unsafe sites, subcontractors can share supplier recommendations, and Corporates can post safety updates or networking events.

Future Scope:

1) What i thought was i'll be adding a multilingual voice assistant in the workers tab so that they'll be able to use app more efficiently
2) I also thought of adding communities for everyone rn i have only added for the coorporate companies but i also thought of adding it for the subcontractor and labours.


## 🏗️ Architecture & Engineering Decisions

When designing BuildGig, the primary focus was on **scalability, real-time data synchronization, and user-role separation**. The construction industry requires immediate communication across different tiers of a project, which dictated the following architectural decisions:

### 1. Three-Tiered Authentication & Routing Strategy
Instead of a monolithic interface, we architected the frontend to have **Role-Based Layouts** (`WorkerLayout`, `SubcontractorLayout`, `CorporateLayout`). 
- **Why?** Each tier of the construction hierarchy requires vastly different tools. Corporate needs high-level command centers (Site Management, Global Budgets), Subcontractors need crew management and bidding tools, and Workers need mobile-first, hyper-focused job boards and attendance tracking. By strictly segregating the routing at the layout level in React Router, we eliminated component bloat and ensured secure, isolated user experiences.

### 2. Flexible Authentication (Email vs. Phone)
- **The Challenge:** While Corporate and Subcontractor users typically operate from offices with standard email setups, the primary demographic for the General Labor workforce often relies exclusively on mobile phones and SMS. 
- **The Solution:** We engineered the `User` database model and the Auth API to dynamically accept either an `email` or a `phone` number based on the `RoleEnum`. The frontend adapts the signup forms in real-time, drastically reducing the friction for blue-collar workers onboarding onto the platform.

### 3. Relational Database with Cascading Data Flows
We utilized PostgreSQL with SQLAlchemy ORM to enforce strict relational integrity.
- **Data Flow:** `Users (Corporate)` -> create -> `Sites`. `Sites` -> broadcast to -> `Marketplace (Subcontractors)`. `Subcontractors` -> post to -> `JobBoard (Workers)`.
- This ensures that a single source of truth exists. When a Subcontractor posts a job (`POST /api/jobs`), the Worker Dashboard instantly reflects this without relying on brittle frontend state management.

### 4. Dynamic API-Driven "Community" Forum
To solve the industry's fragmentation problem, we integrated a real-time Community Discussion feature directly into the Corporate portal. This allows enterprise clients to share best practices, discuss material shortages, and network dynamically, moving away from isolated email chains.

---

## 💻 Tech Stack

### Frontend (Client-Side)
* **Framework:** React.js (Vite)
* **Routing:** React Router DOM (v6)
* **Styling:** Tailwind CSS (Utility-first, responsive, and highly customizable)
* **Icons:** Lucide React (Consistent, lightweight SVG icon system)
* **State Management:** React Hooks (`useState`, `useEffect`) fetching directly from REST APIs.

### Backend (Server-Side)
Framework: FastAPI (Python)
Database: PostgreSQL / SQLite (Development)
Validation: Pydantic
Security: Passlib (Bcrypt) for password hashing, JWT for token-based authentication.

---

## ⚙️ Local Development Setup

### 1. Start the Backend (FastAPI)
```bash
cd backend
python -m venv venv
source venv/Scripts/activate  # On Windows
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
*The API will be available at `http://localhost:8000`*
*Interactive API Docs available at `http://localhost:8000/docs`*

### 2. Start the Frontend (React/Vite)
```bash
# In the root directory
npm install
npm run dev
```
*The app will be available at `http://localhost:5173`*

---

## 📂 Project Structure

```text
├── backend/
│   ├── app/
│   │   ├── api/          # FastAPI Routes (auth, sites, jobs, community, etc.)
│   │   ├── core/         # Security, JWT, Database connections
│   │   ├── crud/         # Database operations (Create, Read, Update, Delete)
│   │   ├── models.py     # SQLAlchemy Database Models
│   │   ├── schemas.py    # Pydantic validation schemas
│   │   └── main.py       # FastAPI application entry point
├── src/
│   ├── layouts/          # Role-based navigational layouts
│   ├── pages/
│   │   ├── Auth/         # Login & Signup flows
│   │   ├── Corporate/    # Enterprise Command Center & Community
│   │   ├── Subcontractor/# Hiring & Crew Management
│   │   └── Worker/       # Job Board & Attendance
│   └── App.jsx           # Global Router
```

Test Credentials if required:




