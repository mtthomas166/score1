Yalla Shoot - Football Live Scores Platform

A live football scores platform built with Node.js, MongoDB, and Socket.io. This project provides real-time updates for matches, players, teams, referees, and leagues.

Yalla Shoot API is a fully-featured football backend system that handles everything related to football data management, including matches, players, teams, leagues, news, transfers, and real-time updates.

The system is built with scalability and performance in mind, following clean architecture principles and modular structure.

🏗 Modules Implemented

I handled and implemented the following modules:

👤 Authentication & Authorization (auth) – with JWT for secure authentication and Bcrypt for password hashing

👥 Users Management

🏟 Teams

🧑‍💼 Coaches

🏟 Stadiums

🏆 Leagues

⭐ Favorite Leagues & Teams

⚽ Matches

👕 Players

📰 News

🔄 Transfers (الانتقالات)

🧑‍⚖️ Referees

📺 Channels

🔎 Search System

📊 Top Soccer Statistics

Each module was designed using a modular structure with proper validation, error handling, and database relations.

⚙️ Technologies Used

This project was built using the following technologies:

Node.js – Backend runtime environment

Express.js – RESTful API framework

MongoDB – NoSQL database

Mongoose – ODM for MongoDB

Joi – Data validation

Axios – External API integration

Socket.io – Real-time match updates

Node-Cron – Scheduled background jobs

JWT (JSON Web Token) – Secure authentication

Bcrypt – Password hashing

🔥 Key Features

✅ Advanced filtering, sorting, pagination, and field limiting

✅ Real-time match updates using Socket.io

✅ Scheduled tasks with Node-Cron

✅ Full authentication system with JWT & Bcrypt

✅ Search functionality across multiple modules

✅ Relational references using Mongoose (populate)

✅ Clean and scalable folder structure

📡 Real-Time Features

Using Socket.io, the system supports:

Live score updates

Real-time match status changes

Instant notifications

🕒 Scheduled Jobs

Using Node-Cron, the system can:

Automatically update match statuses

Run periodic background tasks

Sync external football data

🛠 API Capabilities

The API supports:

CRUD operations for all modules

Advanced query features (Filter, Sort, Pagination, Search)

Data validation using Joi

Secure routes with JWT authentication and role-based authorization

📂 Architecture

The project follows:

Modular architecture

Separation of concerns

Reusable utility classes (e.g., API Features)

Clean error handling

📌 Future Improvements

Add caching with Redis

Add rate limiting

Dockerize the application

CI/CD pipeline
