# Project Setup Steps

## Step 1: Create Project Structure
   - Set up the initial folder and file structure.

## Step 2: Install Dev Tools
   - Installed `nodemon` and `prettier` for development convenience.

## Step 3: Configure Prettier
   - Added `.prettierrc` and `.prettierignore` files to define Prettier settings and ignore patterns.

## Step 4: Connect to MongoDB
   - Created files: `db.js`, `app.js`, `constants.js`, and `index.js`.
   - Installed `mongoose` and `express` packages.
   - Defined `DB_NAME` in `constants.js`.
   - Added `PORT` and `MONGODB_URI` to the `.env` file.
   - Wrote the MongoDB connection code in `db.js` using async/await and a try-catch block.
   - Installed the `dotenv` package to access environment variables globally.
   - Updated `package.json` script to support `dotenv` import.
   - Called the database connection function in `index.js`.

## Step 5: Setup Utility Files
   - Created utility files: `asyncHandler.js`, `APIresponse.js`, and `APIerrors.js`.

## Step 6: Update `app.js`
   - Added additional configurations or middleware as needed in `app.js`.

## Step 7: Define Schemas
   - Wrote schemas for `Video` and `User` models.

## Step 8: Install Additional Packages
   - Installed `jsonwebtoken`, `mongoose-aggregate-paginate`, and `bcrypt` for token handling, pagination, and password hashing.

## Step 9: Implement Middleware for Password Hashing
   - Used `pre` middleware in `user.model.js` to hash passwords before saving them.

## Step 10: Create Access and Refresh Tokens
   - Added user-defined methods in the User model for generating access and refresh tokens.
   - Added token-related keys in the `.env` file for secure access.
