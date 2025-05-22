# School Management API

A REST API system for managing school data built with Node.js, Express.js, and MySQL. The API allows users to add new schools and retrieve schools sorted by proximity to a specified location.

## Features

- Add new schools with name, address, and geographical coordinates
- List all schools sorted by proximity to user location
- Built with security and performance in mind
- Comprehensive error handling and logging
- Input validation for all endpoints
- Rate limiting to prevent abuse

## Technology Stack

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MySQL** - Database
- **Joi** - Input validation
- **Winston** - Logging
- **Helmet** - Security headers
- **Cors** - Cross-origin resource sharing
- **Morgan** - HTTP request logger
- **Rate Limiter** - API request throttling

## Project Structure

```
school-management-api/
├── config/               # Configuration files
├── controllers/          # Request handlers
├── middlewares/          # Custom middlewares
├── models/               # Database models
├── routes/               # API routes
├── utils/                # Utility functions
├── logs/                 # Application logs
├── .env                  # Environment variables
├── app.js                # Express app setup
├── server.js             # Server entry point
└── package.json          # Dependencies
```

## API Endpoints

| Method | Endpoint     | Description                      | Request Body / Query Parameters       |
| ------ | ------------ | -------------------------------- | ------------------------------------- |
| POST   | /addSchool   | Add a new school                 | name, address, latitude, longitude    |
| GET    | /listSchools | List schools sorted by proximity | latitude, longitude (as query params) |
| GET    | /health      | Check API health                 | None                                  |

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- MySQL server

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd school-management-api
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create .env file:

   ```
   PORT=3000
   NODE_ENV=development

   DB_HOST=localhost
   DB_USER=your_mysql_username
   DB_PASSWORD=your_mysql_password
   DB_NAME=school_management
   DB_PORT=3306

   RATE_LIMIT_WINDOW_MS=15000
   RATE_LIMIT_MAX_REQUESTS=100
   ```

4. Set up the database:

   ```bash
   npm run setup-db
   ```

5. Start the server:
   ```bash
   npm run dev
   ```

## Deployment Guide

### Deploying to a VPS or Cloud Server

1. **Provision a server** with Node.js and MySQL installed

2. **Set up MySQL**:

   ```bash
   sudo mysql -u root -p
   ```

   Create a database and user:

   ```sql
   CREATE DATABASE school_management;
   CREATE USER 'schooladmin'@'localhost' IDENTIFIED BY 'your_secure_password';
   GRANT ALL PRIVILEGES ON school_management.* TO 'schooladmin'@'localhost';
   FLUSH PRIVILEGES;
   EXIT;
   ```

3. **Clone and set up the project**:

   ```bash
   git clone <repository-url>
   cd school-management-api
   npm install
   ```

4. **Create production environment file**:

   ```
   PORT=3000
   NODE_ENV=production

   DB_HOST=localhost
   DB_USER=schooladmin
   DB_PASSWORD=your_secure_password
   DB_NAME=school_management
   DB_PORT=3306

   RATE_LIMIT_WINDOW_MS=15000
   RATE_LIMIT_MAX_REQUESTS=100
   ```

5. **Set up the database schema**:

   ```bash
   npm run setup-db
   ```

6. **Use PM2 for process management**:

   ```bash
   npm install -g pm2
   pm2 start server.js --name school-api
   pm2 startup
   pm2 save
   ```

7. **Set up Nginx as a reverse proxy** (optional but recommended):

   ```bash
   sudo apt install nginx
   ```

   Create a new Nginx configuration:

   ```bash
   sudo nano /etc/nginx/sites-available/school-api
   ```

   Add the following configuration:

   ```
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

   Enable the site and restart Nginx:

   ```bash
   sudo ln -s /etc/nginx/sites-available/school-api /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

8. **Set up SSL with Let's Encrypt** (recommended):
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   ```

### Deploying to Heroku

1. **Create a Heroku account** and install the Heroku CLI

2. **Add a Procfile** in the root directory:

   ```
   web: node server.js
   ```

3. **Update the database configuration** to work with Heroku's database URL:

   Edit `config/database.js` to support Heroku's DATABASE_URL:

   ```javascript
   const mysql = require("mysql2/promise");

   let pool;

   if (process.env.DATABASE_URL) {
     // Heroku database URL parsing
     const urlParts = new URL(process.env.DATABASE_URL);
     const auth = urlParts.auth.split(":");

     pool = mysql.createPool({
       host: urlParts.hostname,
       user: auth[0],
       password: auth[1],
       database: urlParts.pathname.substring(1),
       port: urlParts.port,
       ssl: {
         rejectUnauthorized: false,
       },
       waitForConnections: true,
       connectionLimit: 10,
       queueLimit: 0,
     });
   } else {
     // Local database configuration
     pool = mysql.createPool({
       host: process.env.DB_HOST,
       user: process.env.DB_USER,
       password: process.env.DB_PASSWORD,
       database: process.env.DB_NAME,
       port: process.env.DB_PORT,
       waitForConnections: true,
       connectionLimit: 10,
       queueLimit: 0,
     });
   }
   ```

4. **Create a Heroku app and provision a MySQL database**:

   ```bash
   heroku create your-app-name
   heroku addons:create cleardb:ignite --app your-app-name
   ```

5. **Push to Heroku**:

   ```bash
   git push heroku main
   ```

6. **Set up the database schema**:
   ```bash
   heroku run "node ./config/setupDatabase.js" --app your-app-name
   ```

## Using the API with Postman

1. **Import the Postman Collection**:

   - Open Postman
   - Click "Import" button
   - Select the provided collection JSON file or paste its content

2. **Set up the environment variable**:

   - Create a new environment
   - Add a variable `base_url` with:
     - Local: `http://localhost:3000`
     - Production: `https://your-domain.com` or your Heroku URL

3. **Test the endpoints**:
   - Health check: GET `{{base_url}}/health`
   - Add a school: POST `{{base_url}}/addSchool`
   - List schools: GET `{{base_url}}/listSchools?latitude=42.3601&longitude=-71.0589`

## Security Considerations

The API implements several security measures:

- Input validation with Joi
- Security headers with Helmet
- Rate limiting to prevent abuse
- CORS configuration
- SQL injection protection with parameterized queries

## License

This project is licensed under the MIT License.
