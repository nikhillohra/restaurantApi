# Restaurant API

## Overview
This is a RESTful API for managing restaurant data with CRUD operations and location-based proximity search.
The API uses JWT authentication to secure routes, provides pagination for large datasets, and ensures smooth error handling.

## Features
* CRUD Operations: Create, Read, Update, Delete restaurants
* Proximity and Range Search: Search for restaurants based on location
* JWT Authentication: Secures critical endpoints
* Pagination: For large datasets
* Express Validator: Validates input data
* Global Error Handling


** Prerequisites
* Node.js (v14+)
* MongoDB (local or cloud, e.g., MongoDB Atlas)
* Postman (for API testing)

### Environment Variables
Create a .env file at the root of the project and include the following:
PORT=4000  
MONGODB_URI=<your-mongo-db-uri>  
JWT_SECRET=<your-jwt-secret>  

## Installation

* 1. Clone the Repository
* 2. Install Dependencies
* 3. Start by using: npm run dev

## API Endpoints

### Authentication Routes
* POST /api/auth/register - Register a new user
* POST /api/auth/login - Login and get a JWT token

## Restaurant CRUD Routes
* POST /api/restaurants/ - Create a new restaurant
* GET /api/restaurants/ - Retrieve all restaurants (with pagination)
* GET /api/restaurants/:id - Retrieve a restaurant by ID
* PUT /api/restaurants/:id - Update restaurant details
* DELETE /api/restaurants/:id - Delete a restaurant

## Proximity & Range Search Routes
* POST /api/restaurants/proximity - Find restaurants near a location
* POST /api/restaurants/range - Find restaurants within a specified radius

## Pagination
### You can paginate the restaurants with query parameters:
GET /api/restaurants/?page=1&limit=5  

## Testing with Postman
* Import the provided Postman Collection (attached in the repository).
* Use the Bearer Token for restricted routes (set it under the Authorization tab in Postman).
* Validate responses by testing all CRUD and search endpoints.
