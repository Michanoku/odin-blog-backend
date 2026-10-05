// This file loads the required env file so every other module can use it
import dotenv from "dotenv";

/* 
When testing, use another env file specific for that in the dev environment
This is to prevent using the dev or production database in testing, and also suppress
some expected errors during testing.
*/
const envFile = process.env.NODE_ENV === "test" ? ".env.test" : ".env";

dotenv.config({ path: envFile });
