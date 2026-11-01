# 🕵️ AI Mystery Room

An Interactive AI-Powered Detective Investigation Platform.

## About the Project
AI Mystery Room is an interactive detective investigation platform where users solve fictional mystery cases by examining clues and investigating suspects. Users can explore evidence, identify the culprit, and submit their answers to discover the truth.

## Features
- Interactive mystery cases
- Multiple suspects and clues
- New Mystery option
- Answer submission and result feedback
- AI-powered mystery generation

## Technologies Used
- React.js
- Vite
- Node.js
- Express.js
- Google Gemini API

## Live Demo
https://ai-mystery-room-liard-pi.vercel.app/

## Installation

### Clone Repository
```bash
git clone https://github.com/Kavi-0509/ai-mystery-room.git
cd ai-mystery-room
```

### Backend Setup
```bash
cd backend
npm install
npm start
```

Create a `.env` file inside the backend folder and add:
```env
GEMINI_API_KEY=your_gemini_api_key
```

### Frontend Setup
Open another terminal:
```bash
cd frontend
npm install
npm run dev
```

For local development, configure the frontend API URL as:
```env
VITE_API_URL=http://localhost:5000/api
```

## Author
AI Mystery Room Project
