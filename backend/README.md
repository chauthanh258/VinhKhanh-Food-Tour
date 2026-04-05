# Food Tour Backend API

A professional Node.js + TypeScript backend for the Food Tour Application, following a solid layered architecture (MVC + Service).

## Tech Stack
- **Node.js** & **TypeScript**
- **Express** (Web Framework)
- **Prisma** (ORM for PostgreSQL)
- **JWT** (Authentication)
- **Zod** (Validation)
- **Swagger UI** (API Documentation)
- **BcryptJS** (Password Hashing)

## Architecture
1. **Controller Layer**: Handles HTTP requests, extracts parameters, and calls services.
2. **Service Layer**: Contains business logic, authorization rules, and complex calculations (e.g., Geo-distance).
3. **Repository Layer**: Abstraction over Prisma for clean data access.
4. **Middleware**: Auth guards, RBAC, and global error handling.

## Getting Started

### 1. Installation
Navigate to the `backend/` directory and install dependencies:
```bash
cd backend
npm install
```

### 2. Configuration
Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```
Update `DATABASE_URL` with your PostgreSQL connection string.

### 3. Database Setup (Prisma)
Generate the Prisma client and run migrations:
```bash
# Generate client
npx prisma generate

# Run migrations (creates tables in your DB)
npx prisma db push
```

### 4. Data Seeding
Populate the database with 500+ POIs, users, and menu items:
```bash
npm run prisma:seed
```

### 5. Running the API
Start the development server:
```bash
npm run dev
```
The server will run on `http://localhost:3001`.

## Documentation
Once the server is running, access the Swagger UI at:
[http://localhost:3001/api/docs](http://localhost:3001/api/docs)

JSON OpenAPI definition is available at:
[http://localhost:3001/api/openapi.json](http://localhost:3001/api/openapi.json)

## API Endpoints Summary

### Auth
- `POST /api/auth/register` - User/Owner registration
- `POST /api/auth/login` - Get JWT token
- `GET /api/auth/me` - Get current user profile (Auth required)

### POIs (Public)
- `GET /api/pois` - Get nearby POIs (lat, lng, radius, lang)
- `GET /api/pois/:id` - Get POI details with translations and menu items

### Owner Operations (Auth Required)
- `GET /api/owners/:ownerId/pois` - List POIs owned by a user
- `POST /api/pois` - Create a new POI
- `PUT /api/pois/:id` - Update POI (Owner/Admin only)
- `DELETE /api/pois/:id` - Delete POI (Owner/Admin only)

### Menu Items@
- `POST /api/pois/:poiId/menu-items` - Add dish (Owner/Admin only)
- `PUT /api/menu-items/:id` - Edit dish (Owner/Admin only)
- `DELETE /api/menu-items/:id` - Remove dish (Owner/Admin only)

### Admin Operations (Admin Only)
- `GET /api/admin/users` - List all users
- `PUT /api/admin/users/role` - Change user role
- `GET /api/admin/stats` - System statistics
