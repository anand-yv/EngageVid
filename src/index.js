import dotenv from 'dotenv';
import { connectDB } from "./db/index.js";

dotenv.config({ path: './env' })
connectDB();







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