
# Employee Pulse Survey Application

## 🚀 Project Overview
The Employee Pulse Survey Application allows employees to submit surveys and view their past responses, while admins can view all survey data and export it in CSV/JSON formats.

### 🛠️ Tech Stack
- **Frontend:** React.js
- **Backend:** NestJS (TypeScript)
- **Database:** MongoDB

## 📦 Installation and Setup
### 1. Clone the repository
```bash
git clone <repository-url>
cd employee-pulse-survey
```

### 2. Install dependencies
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 3. Environment Variables
Create a `.env` file in the `backend` directory with the following variables:
```
MONGO_URI=<Your MongoDB URI>
JWT_SECRET=<Your JWT Secret>
PORT=3000
```

### 4. Running the application
```bash
# Start backend
cd backend
npm run start:dev

# Start frontend
cd frontend
npm start
```

Backend will run on `http://localhost:3000`  
Frontend will run on `http://localhost:3001`

## 🔥 API Endpoints

### **Authentication APIs**
- `POST /auth/register` → Register a new user.
- `POST /auth/login` → Login user and receive JWT.

### **Survey APIs**
- `POST /survey` → Submit a survey.
- `GET /survey` → Retrieve all user surveys.

### **Admin APIs**
- `GET /admin/surveys` → View all survey responses.
- `GET /export/csv` → Export data as CSV (Admin only).
- `GET /export/json` → Export data as JSON (Admin only).

## 🧪 Running Tests
### 1. Run Unit and Integration Tests
```bash
cd backend
npm run test
```

### 2. Run End-to-End Tests
```bash
npm run test:e2e
```

## ✅ Testing Strategy
- **Unit Tests:** Service and controller logic validation.
- **Integration Tests:** Module interaction verification.
- **End-to-End Tests:** Simulating full workflows.

## 📊 Export Functionality
- Admins can export survey data in CSV or JSON format.
- Exported files contain user email, date, and survey responses.

## 💡 Future Improvements
- Pagination for survey data.
- User profile management.
- Enhanced UI/UX with filtering options.

## 👨‍💻 Author
- **Your Name**
- Email: vamshi92n@gmail.com
- GitHub: [Your GitHub](https://github.com/yvamsineeluri1)

---

### 🎯 Thank you for reviewing the Employee Pulse Survey Application! 🚀
