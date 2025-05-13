# CSV Upload App

This full-stack web application allows users to upload CSV files, stores the data in a PostgreSQL database, and provides a searchable, paginated frontend UI to view the uploaded data.

## Tech Stack

- Frontend: React (TypeScript)
- Backend: Node.js + Express + Multer (TypeScript)
- Database: PostgreSQL

## Getting Started

To get started with local development, follow these steps:

- Clone the repository.
- In the frontend folder, run npm start in the terminal.
- In the backend/src folder, run npx ts-node index.ts.

Backend Requirements

- Create a table named uploads in PSQL:

CREATE TABLE uploads (
id SERIAL PRIMARY KEY,
data JSONB
);

- In backend/src/upload.ts, configure your database connection like this:

const pool = new Pool({
user: "postgres",
host: "localhost",
database: "postgres",
password: "", // Set your DB password if needed
port: 5432,
});
