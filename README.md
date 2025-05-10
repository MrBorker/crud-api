# Detailed instructions for installing, running and using the application

✅ Prerequisites
Before you begin, make sure you have the following installed:

Node.js (v22+)

npm

(Optional) Postman or curl for testing the API

📁 Installation
Clone the repository:

git clone https://github.com/MrBorker/crud-api.git
cd crud-api
Install dependencies:

npm install
⚙️ Environment Setup
Create a .env file if required and set environment variables (like PORT, NODE_ENV, etc.):

PORT=4000
If you're not using .env, you can directly configure it inside config.js.

🚀 Running the Application

1. Run in development mode (with live reload, using nodemon):
   npm run dev
   Make sure nodemon is installed globally or as a dev dependency.

2. Run in production mode (single instance):
   npm start

3. Run in multi-core mode (Cluster + Load Balancer):
   This will start the load balancer on port 4000 and N worker instances on ports 4001, 4002, ..., depending on CPU cores.

npm run start:multi

🔄 API Usage
You can interact with the API via any HTTP client like Postman, or curl.

Sample Endpoints
GET /api/users – get all users
GET /api/users/{userId} – get user by ID
POST /api/users – create a user
DELETE /api/users/{userId} – delete a user
PUT api/users/{userId}
