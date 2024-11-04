import { connectDB } from "./db/db.js";
import dotenv from 'dotenv';
import { app } from "./app.js";
const Port = process.env.PORT || 5050;

dotenv.config({
    path: "./.env"
});

connectDB()
    .then(() => {
        app.listen(Port, () => {
        console.log(`MongoDB connected sucessfully and listinig at port ${Port}`);
        })
    })
    .catch((err) => {
        console.error("MONGODB connection failed", err)
    })