 Bling Blogs

Bling Blogs is a full-stack blogging platform built with the MERN stack. It allows users to create, publish, discover, and interact with blog posts through a modern and responsive interface.

The project was developed to practice full-stack web development concepts including REST APIs, authentication, database management, cloud image storage, rich-text editing, user interactions, and frontend-backend integration.

 🚀 Live Demo

Visit Bling Blogs](https://bling-blogs.vercel.app/)

 📂 Repository

GitHub Repository](https://github.com/zoha39/Bling_Blogs

 ✨ Features

 🔐 Authentication & Authorization

* User registration and login
* JWT-based authentication
* Protected routes
* Persistent authenticated sessions
* Authentication state management
* User logout functionality
* Authorization for user-specific actions

 📝 Blog Management

* Create and publish blog posts
* Write blogs using a rich-text editor
* Edit your own published blogs
* Delete your own blogs
* View individual blog posts
* View blogs written by a specific author
* Blog title and content management
* Add images to blog content

 🖼️ Image Integration

* Cloudinary integration for image uploads
* Upload images directly while creating blog content
* Unsplash API integration for discovering images
* Environment variables used for API configuration

## 🎥 Media Support

* Add YouTube videos to blog content
* Embedded video support
* Backend validation for submitted video URLs

 ❤️ Blog Interactions

* Like and unlike blog posts
* Save blogs to a personal reading list
* Comment on blog posts
* View responses/comments
* Manage saved content

 🔎 Search

* Search blogs by title
* Search blogs by author
* Dynamic search through the application's interface

 👤 User Profiles

* View user profiles
* View authored blogs
* Edit profile information
* Manage user-specific content

 📚 Library

The Library provides separate sections for managing different types of user content:

* Your List — content associated with the user's reading activity
* Saved — blogs saved for later
* Responses — comments and responses associated with the user

 🎨 User Interface

* Responsive layout
* Custom loading animation
* Progressive "BLING" loading animation
* Navigation with integrated search
* Blog cards
* Sidebar navigation
* Dedicated writing interface
* Profile interface
* Library interface

 🛠️ Tech Stack

 Frontend

* React.js
* JavaScript
* CSS
* React Router
* Axios
* TinyMCE

 Backend

* Node.js
* Express.js
* MongoDB
* Mongoose

 Authentication & Security

* JSON Web Tokens (JWT
* bcryptjs
* Cookie-based authentication
* CORS
* Environment variables

 Cloud & APIs

* **Cloudinary** — image storage and management
* **Unsplash API** — image discovery

 Development Tools

* Git
* GitHub
* Vercel
* Railway
* VS Code

 🏗️ Project Architecture

Bling Blogs follows a separated frontend-backend architecture:

Bling_Blogs/
│
├── frontend/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── assets/
│   └── ...
│
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   └── ...
│
└── .gitignore


The frontend communicates with the Express backend through REST API endpoints.

The backend handles authentication, authorization, blog operations, comments, user operations, and external service integrations.

MongoDB is used to store application data, while Cloudinary handles uploaded images.

 🔄 How the Application Works

The application follows a typical full-stack request flow:

User
  │
  ▼
React Frontend
  │
  │ HTTP Requests
  ▼
Express.js API
  │
  ├── Authentication
  ├── Blog Operations
  ├── User Operations
  ├── Comments
  └── External APIs
  │
  ▼
MongoDB

For image-related operations, the application also communicates with Cloudinary, while Unsplash is used for image discovery.

 🔐 Authentication Flow

Bling Blogs uses JWT-based authentication to protect user-specific functionality.

A simplified authentication flow is:

User Login
    │
    ▼
React Frontend
    │
    ▼
Express API
    │
    ├── Validate Credentials
    │
    ├── Verify Password
    │
    └── Generate JWT
            │
            ▼
       Authenticated User


Protected operations require the user to be authenticated and authorized before they can be performed.

For example, users can only edit or delete their own blog posts.

 📝 Blog Creation Flow

A user can create a blog through the writing interface.

Write Blog
    │
    ├── Add Title
    ├── Write Content
    ├── Add Images
    ├── Add YouTube Video
    │
    ▼
Publish
    │
    ▼
Backend API
    │
    ├── Validate Request
    ├── Process Content
    └── Store Blog
            │
            ▼
          MongoDB


TinyMCE provides the rich-text editing experience, while Cloudinary is used for image storage.

 🗄️ Database

MongoDB is used as the application's primary database.

Mongoose provides the object modeling layer between the Express backend and MongoDB.

The application manages data related to:

* Users
* Blogs
* Comments
* Likes
* Saved blogs
* User profiles

 ☁️ Cloudinary Integration

Images used in blog content are handled through Cloudinary rather than being stored directly inside the application server.

This provides a dedicated cloud-based solution for:

* Image uploads
* Image hosting
* Image URLs
* Media management

 🌐 Unsplash Integration

The application integrates the Unsplash API to allow users to search for images that can be used while creating blog content.

The API key is kept outside the source code through environment variables.

 ⚙️ Environment Variables

Both the frontend and backend require environment-specific configuration.

Create the appropriate `.env` files based on the variables used by the project.

Example backend configuration:

MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
FRONTEND_URL=your_frontend_url
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret


Example frontend configuration:

VITE_API_URL=your_backend_api_url
VITE_UNSPLASH_ACCESS_KEY=your_unsplash_access_key


**Never commit real API keys, database credentials, JWT secrets, or other sensitive environment variables to GitHub.**

 📦 Installation

 1. Clone the repository

git clone https://github.com/zoha39/Bling_Blogs.git


 2. Navigate into the project

cd Bling_Blogs


 3. Install backend dependencies

cd backend
npm install


 4. Configure backend environment variables

Create a `.env` file inside the `backend` directory and add the required environment variables.

 5. Start the backend

npm run dev


 6. Install frontend dependencies

Open another terminal:

cd frontend
npm install


 7. Configure frontend environment variables

Create the required `.env` file inside the `frontend` directory.

 8. Start the frontend

npm run dev


The frontend and backend will then run as separate development applications.

 🚀 Deployment

The application uses separate deployment environments for the frontend and backend.

* Frontend: Vercel
* Backend: Railway
* Database: MongoDB
* Image Storage: Cloudinary

The frontend communicates with the deployed Express API through the configured production API URL.

 🧠 Key Development Concepts

This project provided practical experience with:

* MERN stack development
* REST API development
* React component architecture
* React Router
* Express.js routing
* MongoDB and Mongoose
* JWT authentication
* Authorization and protected routes
* Password hashing with bcrypt
* HTTP cookies
* CORS configuration
* Multipart form-data handling
* Image uploading
* Cloudinary integration
* Third-party API integration
* Rich-text editors
* CRUD operations
* Blog content management
* User profiles
* Comments and interactions
* Frontend-backend communication
* Environment variable management
* Production deployment

 🎯 Project Goals

The main goal of Bling Blogs was to build a complete full-stack application rather than a static frontend project.

Through this project, I practiced the complete development workflow:

Planning
   ↓
Frontend Development
   ↓
Backend API Development
   ↓
Database Integration
   ↓
Authentication
   ↓
Third-Party Services
   ↓
Frontend + Backend Integration
   ↓
Deployment


 🔮 Future Improvements

Possible improvements include:

* Real-time notifications
* Follow/unfollow users
* Blog categories and tags
* Advanced blog recommendations
* Pagination and infinite scrolling
* Advanced search and filtering
* Reading-time calculation
* Draft blog support
* Admin dashboard
* Content moderation
* Email verification
* Password reset functionality
* Social sharing
* Improved accessibility
* Automated testing

