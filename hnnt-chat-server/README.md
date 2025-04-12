## Necessary Technologies

-   Node.js, npm, PostgreSQL, pgAdmin, Redis

## Steps to Set Up the Project

1. **Install Dependencies**  
   Update `node_modules` using `package-lock.json`:

    ```bash
    npm install
    ```

2. **Set Up Environment Variables**  
   Create a `.env` file in the root directory of the project. Use `.env.sample` as a reference and update the values as needed for your local environment.

3. **Run SQL Scripts**  
   Execute the `.sql` script files located in `src/prisma/migrations`.

4. **Seed the Database**  
   Add sample data using the command:

    ```bash
    npm run seed
    ```

## Mapping Directly to PostgreSQL (If Needed)

1. **Configure the Database**  
   Update the `.env` file based on `.env.sample`.

2. **Run Migrations**  
   Map the database using the command:

    ```bash
    npm run migrate
    ```

3. **Seed the Database**  
   Add sample data using the command:

    ```bash
    npm run seed
    ```
