# University Research Opportunity Portal

A web-based application for managing university research opportunities.

## GitHub Repository

https://github.com/p240041-cell/research-opportunity-portal

## Features

- Create research opportunities
- View all research opportunities
- View details of a selected opportunity
- Update existing opportunities
- Change status from Open to Closed
- Delete opportunities
- Validate required form fields
- Display success and error messages
- REST API connected to a MySQL database
- Postman API testing collection

## Technologies

### Backend
- Node.js
- Express.js
- MySQL
- mysql2
- dotenv
- CORS

### Frontend
- HTML
- CSS
- JavaScript
- Bootstrap

## Project Structure

```text
research-opportunity-portal/
├── backend/
│   ├── server.js
│   ├── package.json
│   └── .env.example
├── database/
│   └── schema.sql
├── frontend/
│   ├── index.html
│   ├── app.js
│   └── style.css
├── postman/
│   └── Research_Portal.postman_collection.json
├── .gitignore
└── README.md
```

## Prerequisites

- Node.js and npm
- MySQL Server
- Python 3 (for the simple frontend server)
- Postman (for API testing)

## Database Setup

1. Start the MySQL server.
2. Open a terminal in the project directory.
3. Run the following command:

```bash
mysql -u root -p < database/schema.sql
```

4. Enter your MySQL password when prompted.

This command creates the `research_portal` database and its opportunities table.

## Backend Setup

1. Open a terminal in the project directory.
2. Go to the backend folder:

```bash
cd backend
```

3. Install dependencies:

```bash
npm install
```

4. Create a `.env` file inside the backend folder using `.env.example` as a reference. Set your own local MySQL credentials. Do not upload `.env` to GitHub.

Required environment variables:

```text
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=YOUR_MYSQL_PASSWORD
DB_NAME=research_portal
```

5. Start the backend:

```bash
node server.js
```

The backend should run at:

http://localhost:3000

## Frontend Setup

Open a second terminal and run:

```bash
cd ~/projects/research-opportunity-portal/frontend
python3 -m http.server 5500
```

Open this address in your browser:

http://localhost:5500

Keep the backend and frontend servers running while using the application.

## API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| POST | /api/opportunities | Create an opportunity |
| GET | /api/opportunities | Retrieve all opportunities |
| GET | /api/opportunities/:id | Retrieve one opportunity |
| PUT | /api/opportunities/:id | Update an opportunity |
| DELETE | /api/opportunities/:id | Delete an opportunity |

## Postman Testing

Import the collection from:

`postman/Research_Portal.postman_collection.json`

Test creating at least three opportunities, retrieving all and one opportunity, updating an opportunity, closing it, deleting it, requesting the deleted opportunity again, and submitting invalid data.

## Security

Never upload `.env`, database passwords, API keys, personal access tokens, or other private credentials to GitHub.
