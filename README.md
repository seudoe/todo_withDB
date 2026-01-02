# TODOER

## What is it?
A simple cloud-based todo application that allows users to create, manage, and track their tasks. Users can register/login with email and password, add new todos, mark them as complete, and all data is stored in MongoDB Atlas cloud database.

## How to run it?
```bash
node ./server/index.js
```

The server will start on port 8899. Open your browser and navigate to `http://localhost:8899` to access the application.

## Tech Stack
- **Frontend**: Pure HTML, CSS, and JavaScript (no frameworks used - everything is hardcoded)
- **Backend**: Express.js server
- **Database**: MongoDB Atlas (cloud database)
- **Authentication**: Simple email/password based system

## Project Structure
```
todo_withDB/
├── server/
│   ├── index.js        # Main server file
│   ├── db.js          # Database connection
│   ├── middleman.js   # Database operations middleware
│   └── .env           # Environment variables (MongoDB URI)
├── index.html         # Landing page
├── login.html         # Login/Register page
├── home.html          # Main todo interface
├── home.css           # Styling for todo interface
├── login.js           # Login/Register functionality
├── home.js            # Todo management logic
├── list.js            # Todo list operations
└── css/               # Additional stylesheets
```

## Features
- User registration and login
- Add new todos
- Mark todos as complete/incomplete
- Persistent storage in MongoDB Atlas
- Responsive design
- Local storage for session management

## Setup Requirements
1. Node.js installed
2. MongoDB Atlas account and connection string
3. Create `.env` file in server directory with:
   ```
   MONGO_URI=your_mongodb_atlas_connection_string
   ```

## API Endpoints
- `GET /` - Landing page
- `GET /login` - Login page
- `POST /login` - Handle login/register
- `GET /home` - Todo interface
- `POST /home` - Get user todos
- `PUT /home` - Update user todos

## Notes
- No external frontend frameworks used - pure vanilla JavaScript
- All styling and interactions are hardcoded
- Uses Express.js only for server-side operations
- Data persists in MongoDB Atlas cloud database