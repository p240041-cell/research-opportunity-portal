# University Research Opportunity Portal

This is a web application for managing university research opportunities. Faculty members can add, view, update, close, and delete research opportunities. All opportunity data is stored in a MySQL database.

## GitHub Repository

https://github.com/p240041-cell/research-opportunity-portal

## Technologies Used

- Backend: Node.js, Express.js
- Database: MySQL
- Frontend: HTML, CSS, JavaScript
- API Testing: Postman

## Features

- Add research opportunities
- View all opportunities and their details
- Update opportunity information
- Change status from Open to Closed
- Delete opportunities
- Form validation and success/error messages

## Database Setup

Run this command from the project folder:

    mysql -u root -p < database/schema.sql

## Run the Backend

    cd backend
    npm install

Create a `.env` file using `.env.example` and add your MySQL connection details. Do not upload `.env` to GitHub.

Start the server:

    node server.js

Backend URL: http://localhost:3000

## Run the Frontend

Open a second terminal and run:

    cd ~/projects/research-opportunity-portal/frontend
    python3 -m http.server 5500

Open http://localhost:5500 in your browser.

Keep both servers running.

## API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/opportunities` | Create an opportunity |
| GET | `/api/opportunities` | Get all opportunities |
| GET | `/api/opportunities/:id` | Get one opportunity |
| PUT | `/api/opportunities/:id` | Update an opportunity |
| DELETE | `/api/opportunities/:id` | Delete an opportunity |

## Postman Testing

Import `postman/Research_Portal.postman_collection.json` into Postman to test the API.

## Security

Do not upload passwords, `.env` files, or private tokens to GitHub.
