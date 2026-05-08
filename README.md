# 📝 Google Docs Clone (Real-Time Collaborative Editor)

A full-stack real-time collaborative document editor inspired by Google Docs. Multiple users can create, edit, and sync documents simultaneously with live updates.

---


* Real-time collaboration (multiple users editing simultaneously)
*  Rich text editing experience using Quill
* Live synchronization of document changes
* Persistent document storage in backend
* Document-based rooms for collaboration
* Instant updates using WebSockets (Socket.IO)

---

##  System Overview

This project implements a real-time collaboration system using a client-server WebSocket architecture:

* The **frontend (React)** handles the editor UI and user interactions.
* The **backend (Node.js + Express)** manages document state and connections.
* **Socket.IO** enables real-time bidirectional communication between clients and server.
* Each document acts as a “room”, and updates are broadcast to all connected users in that room.
* Changes are persisted in the database to ensure data consistency.

---

## Tech Stack

**Frontend:**

* React
* Quill Library
* Socket.IO Client

**Backend:**

* Node.js
* Express
* Socket.IO

**Database:**

* MongoDB 

---

## How It Works

1. A user opens or creates a document.
2. The user joins a Socket.IO room based on the document ID.
3. Any text changes are emitted to the server in real time.
4. The server broadcasts updates to all connected clients in that room.
5. Document state is saved to the database for persistence.

---


---

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/Bukho127/google-docs-clone.git
```

### 2. Install dependencies

#### Client

```bash
cd frontend
cd google-docs-clone
npm install
npm run dev
```

#### Server

```bash
cd server
npm install
npm start to start the server
```

---

## Future Improvements

* User authentication (login system)
* document sharing                                                     
* Version history / document revision tracking
* Cursor tracking per user
* Better conflict resolution handling
* Deployment (Vercel + Render / AWS)

---

## Author

Bukho Mabhula
IT Student | Full-stack Developer
React • Node.js • Real-time Systems
