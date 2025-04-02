import mongoose from "mongoose";
import 'dotenv/config'

export const connectToDB = async () => {

    const isProduction = process.env.NODE_ENV === 'production';

    const uri = isProduction
        ? process.env.DATABASE_URI_PROD
        : process.env.DATABASE_URI_DEV;
    await mongoose.connect(
        uri
    )
        .then(() => console.log(`Connected to DB (${isProduction ? 'PROD' : 'DEV'})`))
        .catch(err => { console.log("DB error", err) })
}