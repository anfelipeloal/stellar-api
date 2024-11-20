<h1 align="center">Stellar API</h1>

## Description

The Stellar API is a dynamic pricing system created to manage the room reservation according to availability in the Stellar Stay Hotel.

## Stack
- Backend: NestJs and TypeScript.
- Database: PostgreSQL.
- Prisma ORM.
- Testing with Jest.
- Swagger for API documentation.

## Requirements for Local Development
- Node.js 18 or later
- NPM
- PostgreSQL (Optional pgAdmin)

## Project setup

### Install Dependencies

```bash
$ npm install
```

### Database
From **.env.example** file create a copy, rename it to **.env** and update the **DATABASE_URL** connection string with your data.

Then you can run the migration command

```bash
$ npx prisma migrate deploy
```

Generate the client
```bash
$ npx prisma generate
```

Then seed the data base with the initial data

```bash
$ npx prisma db seed
```

## Running the App

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# test coverage
$ npm run test:cov
```

## Using and Testing the API

Once you excecute the command `npm run start` or `npm run start:dev` you can test it int two ways:
- **Swagger:** Navigate to http://localhost:3000/api to see the API Swagger documentation.
- **Postman:** Import the attached **collection_postman_Stellar.json** in the root to Postman.

