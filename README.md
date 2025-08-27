# DSA Sheet - Apna College 373

A comprehensive Data Structures and Algorithms practice platform built with React and Node.js.

## Features

- **Problem Tracking**: Track your DSA problem-solving progress
- **User Authentication**: Secure login/signup with Google OAuth
- **Progress Dashboard**: Visual progress tracking and statistics
- **Daily Problems**: Get daily problem recommendations
- **Responsive Design**: Works on all devices

## Tech Stack

### Frontend
- React 18
- Vite
- Tailwind CSS
- Context API for state management

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Google OAuth 2.0
- Bcrypt for password hashing

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB
- Google OAuth credentials

### Installation

1. Clone the repository
```bash
git clone https://github.com/shivamshrma09/ApnaCollegeDSASheet.git
cd ApnaCollegeDSASheet
```

2. Install dependencies
```bash
# Install root dependencies
npm install

# Install backend dependencies
cd Backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Environment Setup
Create `.env` files in both Backend and frontend directories with required variables.

4. Start the application
```bash
# Start backend (from Backend directory)
npm start

# Start frontend (from frontend directory)
npm run dev
```

## Project Structure

```
├── Backend/           # Node.js backend
│   ├── controllers/   # Route controllers
│   ├── models/        # MongoDB models
│   ├── routes/        # API routes
│   ├── middleware/    # Custom middleware
│   └── config/        # Database configuration
├── frontend/          # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── data/
│   │   └── hooks/
│   └── public/
└── README.md
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).
