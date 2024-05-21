import dotenv from 'dotenv';
import { connectDB } from "./db/index.js";
import { app } from './app.js';
dotenv.config({ path: './env' })

connectDB()
    .then(() => {
        app.on(error, (error) => {
            console.log("Error : ", error);
            throw error;
        })
        app.listen(process.env.PORT || 8000, () => {
            console.log(`Server is listening at port: ${process.env.PORT}`)
        })
    })
    .catch((error) => {
        console.log("Mongo DB Connection Failed !!! ", error);
    })





































/*
;(async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        app.on("error", (error) => {
            console.log("Error : ", err);
            throw error;
        })

        app.listen(process.env.PORT, () => {
            console.log(`Server is listening at : ${process.env.PORT}`);
        })
    } catch (error) {
        console.error("Error : ", error);
    }
})()
*/