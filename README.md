Invoice Manager is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) - it helps you track your expenses organized in payment-company-project structure.

## Setting the project up

1. Download and install PostgreSQL - [official postgresql website](https://www.postgresql.org/download/)

2. Create project's database, you can name it anyway you like it.

3. Download and install Node.js - [official nodejs prebuilt installer](https://nodejs.org/en/download/prebuilt-installer).

4. Clone this project's GitHub repository.

5. Open CLI and navigate to the project's directory.

6. Create two files in the project's directory: ".env" and ".env.local".

7. Inside ".env" create the environmental variable with your database connection URL:

   DATABASE_URL="postgresql://username:password@localhost:port/database_name?schema=public"

   - username: your PostgreSQL username,
   - password: your database password,
   - localhost: PostgreSQL server address - this one runs locally on your machine, so you can leave it as 'localhost',
   - port: PostgreSQL port - the default is '5432',
   - database_name: name of the created database.

8. Inside ".env.local" create 3 environmental variables:

   DATABASE_URL="postgresql://username:password@localhost:port/database_name?schema=public" // the same as in ".env"

   AUTH_SECRET=jNBnjgh5fz+9h8PQvphv4SUr54JUXakxnwcGpPOQ8ww= // the secret required to sign the session JWT token - in order to generate 32 random bytes you can use the following command: `openssl rand -base64 32`

   AUTH_TRUST_HOST=true // required by the session management library

9. Install project's dependencies by running: 'npm install' in your CLI.

10. Run 'npx prisma migrate dev' in order to create tables and structures in your PostgreSQL database according to the project's model.

11. Generate Prisma Client to enable interaction between the app and database by running: 'npx prisma generate'.

12. Build the project using: 'npm run build' command.

13. Start application: 'npm start'.
