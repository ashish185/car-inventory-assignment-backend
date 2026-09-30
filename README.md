# Car Inventory Backend

A backend service that ingests vehicle make and vehicle-type data from the
[NHTSA vPIC API](https://vpic.nhtsa.dot.gov/api/), transforms it from XML into a
unified JSON structure, persists it in MongoDB, and exposes it through a single
GraphQL endpoint.

## Tech Stack

- **Language:** TypeScript (strict mode)
- **HTTP framework:** Express
- **GraphQL:** Apollo Server 5 (schema-first)
- **Database:** MongoDB via Mongoose
- **XML parsing:** fast-xml-parser
- **Config validation:** Zod
- **Logging:** Pino (structured JSON logs)
- **Testing:** Jest + ts-jest
- **Containerization:** Docker + docker-compose

## Project Structure

```
src/
  config/             Environment schema (Zod), typed config, DB connection, logger
  common/
    errors/           Typed application error classes
    error-handler.ts  Express error-handling middleware
  modules/
    vehicle-make/     Types, XML transform, repository, resolvers,
                       ingestion service (NHTSA fetch via axios) + CLI entrypoint
  graphql/            SDL schema, resolvers, Apollo Server wiring
  app.ts              Express app assembly
  main.ts             Process bootstrap (connect DB, start HTTP server, graceful shutdown)
test/
  unit/               Unit tests
  fixtures/           Sample NHTSA XML payloads used by tests
```

## Prerequisites

- Node.js 20+
- Docker + Docker Compose (recommended for local run)
- Or: a local/remote MongoDB instance if not using Docker

## Running Locally (Docker — recommended)

```bash
docker compose up --build
```

```bash
docker compose logs -f mongo — mongo logs only
docker compose logs -f app — backend logs only
```

This starts MongoDB and the app together. The app connects to the `mongo`
service automatically. Once it's up:

```bash
# Populate the database (run once, or whenever you want to refresh the data)
docker compose exec app node dist/modules/vehicle-make/run-ingestion.js
```

The GraphQL endpoint is now available at `http://localhost:4000/graphql`.

The server listens on `http://localhost:4000` by default; GraphQL is served at
`/graphql` and a health check at `/health`.

## Build Instructions

```bash
npm run build       # Compiles TypeScript to dist/ (and copies the GraphQL SDL file)
npm start           # Runs the compiled server from dist/
```

## Data Model

Each vehicle make is stored as a single MongoDB document (collection
`vehiclemakes`), upserted by `makeId` so re-running ingestion is idempotent:

```json
{
  "makeId": "440",
  "makeName": "ASTON MARTIN",
  "vehicleTypes": [
    { "typeId": "2", "typeName": "Passenger Car" },
    { "typeId": "7", "typeName": "Multipurpose Passenger Vehicle (MPV)" }
  ]
}
```

## Connecting with MongoDB Compass

Whether MongoDB is running via Docker Compose or locally, the container/instance
publishes port 27017 to your host, so Compass connects the same way in both
cases:

1. Make sure MongoDB is running (`docker compose up -d mongo`, or a local
   `mongod`).
2. Open Compass and create a new connection with:
   ```
   mongodb://localhost:27017/car-inventory
   ```
3. Click **Connect**.

No username/password is required — the `mongo` service doesn't have auth
enabled, which is fine for local development.

The `car-inventory` database and `vehiclemakes` collection only appear once
ingestion has written data, so run `npm run ingest` (or
`docker compose exec app node dist/modules/vehicle-make/run-ingestion.js`)
first if you don't see them yet.

> Note: if you're connecting from *inside* another Docker container (not from
> your host machine), use `mongodb://mongo:27017/car-inventory` instead —
> `mongo` is only resolvable within the Docker network.

## GraphQL Schema

Full SDL: [`src/modules/vehicle-make/vehicle-make.schema.graphql`](src/modules/vehicle-make/vehicle-make.schema.graphql).

```graphql
type VehicleType {
  typeId: ID!
  typeName: String!
}

type VehicleMake {
  makeId: ID!
  makeName: String!
  vehicleTypes: [VehicleType!]!
}

type Query {
  vehicleMakes(makeNameContains: String): [VehicleMake!]!
  vehicleMake(makeId: ID!): VehicleMake
}
```

### Example Queries

Fetch all makes with their vehicle types:

```graphql
query AllMakes {
  vehicleMakes {
    makeId
    makeName
    vehicleTypes {
      typeId
      typeName
    }
  }
}
```


Fetch a single make by ID:

```graphql
query SingleMake {
  vehicleMake(makeId: "440") {
    makeName
    vehicleTypes {
      typeName
    }
  }
}
```

## Testing

```bash
npm test          # Run all unit tests
npm run test:cov  # Run with coverage report
```

Unit tests cover the XML → domain transformation logic (multiple entries,
single-entry XML normalization).

No test hits the real NHTSA API or a real database.
