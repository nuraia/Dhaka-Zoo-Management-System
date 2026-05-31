# Dhaka Zoo Management System

Dhaka Zoo Management System is a full-stack database project for a Mirpur/Dhaka Zoo style visitor experience. It combines a public-facing React website with an Express API, JWT auth, Prisma ORM, PostgreSQL, normalized zoo operations data, and seed data large enough to demonstrate meaningful relational queries.

## Tech Stack

- Frontend: React, Vite, React Router, CSS custom properties
- Backend: Node.js, Express
- ORM: Prisma
- Database: PostgreSQL
- Auth: JWT
- Validation: Zod
- Password hashing: bcryptjs

## Main Features

- Modern home page with hero, featured animals, zone previews, feeding teaser, and visitor information
- Animal directory with search, zone filter, diet filter, health filter, and detail modal
- Auth pages for visitor registration and sign in
- Protected ticket booking with adult, child, and family pricing
- Unique ticket code generation and visitor ticket history
- Feeding schedule endpoints with mark-fed logging
- Normalized Prisma schema with indexes and relational seed data

## Core Entities

- User
- Animal
- Species
- Zone
- FeedingSchedule
- FoodItem
- Ticket
- TicketZone
- DayPlan
- DayPlanZone
- HealthRecord
- FeedingLog
- AuditLog
- Authority
- Caregiver
- FoodSupplier

## Database Design Notes

The schema is normalized so repeated descriptive data is stored once and referenced by foreign keys. `Species`, `Zone`, and `FoodItem` are separate tables because many animals share the same species profile, many animals live in the same zone, and many feeding schedules reuse the same food definitions. This avoids duplicated diet, habitat, zone, and unit text across animal and feeding rows.

`DayPlanZone` is a join table instead of a raw `planned_zones` array. That design works cleanly across PostgreSQL and Prisma, lets each zone keep a `visit_order`, supports foreign key integrity, and allows joins such as "which plans include Aviary Garden?"

Useful indexes were added for common lookups:

- `User.email` is unique for login.
- `Animal.name` supports animal search.
- `Animal.species_id` and `Animal.zone_id` support filtering and joins.
- `Ticket.visit_date` supports visit-day reporting.
- Additional indexes support feed logs, day plans, and audit lookups.

Joins are used throughout the app: animal details join `Animal -> Species -> Zone`, feeding views join `FeedingSchedule -> Animal -> FoodItem`, and ticket history joins `Ticket -> User` plus optional `TicketZone -> Zone`.

## Local Setup

### 1. Environment

Copy `.env.example` into `server/.env` and fill in values:

```bash
cp .env.example server/.env
```

Required values:

```env
DATABASE_URL=
JWT_SECRET=
PORT=5000
CLIENT_URL=http://localhost:5173
CLAUDE_API_KEY=
```

`CLAUDE_API_KEY` is reserved for future ZooBot work and is not used by the current backend.

### 2. Backend

```bash
cd server
npm install
npm run prisma:generate
npm run prisma:migrate
npm run seed
npm run dev
```

If you are using a disposable local database and do not need migration history, `npm run prisma:push` can be used instead of `npm run prisma:migrate`.

### 3. Frontend

```bash
cd client
npm install
npm run dev
```

The frontend expects the API at `http://localhost:5000/api` by default. You can override it with `VITE_API_URL`.

## Seed Data

The seed script creates:

- 33 animals
- 12 species groups
- 7 zones
- 12 food items
- Feeding schedules for every seeded animal
- Health records
- One seeded admin account
- One demo visitor account with a sample ticket and day plan

Demo credentials for local development:

- Admin: `admin@dhakazoo.local` / `Admin12345`
- Visitor: `visitor@dhakazoo.local` / `Visitor12345`

These credentials are for local demos only.

## API Routes

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Animals

- `GET /api/animals`
- `GET /api/animals/:id`
- `POST /api/animals`
- `PUT /api/animals/:id`

### Tickets

- `POST /api/tickets/book`
- `GET /api/tickets/my`
- `GET /api/tickets/:id`
- `POST /api/tickets/validate`

### Feeding

- `GET /api/feeding`
- `POST /api/feeding`
- `POST /api/feeding/:id/mark-fed`

### Other

- `GET /api/health`
- `GET /api/zones`
- `POST /api/day-plans`
- `GET /api/day-plans/:date`
- `PUT /api/day-plans/:id`
- `POST /api/enquiry`

## Screenshots

Add screenshots here after running the frontend locally:

- Home page
- Animal directory
- Ticket booking
- Auth pages

## Future Work

- ZooBot with Claude API
- Full day planner UI
- Health timeline UI
- Audit log viewer
- Database views for visitor and feeding summaries
- Stored procedure or trigger for ticket capacity enforcement
- Admin dashboard for animals, health records, and feeding operations
