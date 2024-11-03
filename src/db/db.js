import mongoose from 'mongoose';
import { DB_NAME } from '../constants.js';

export const connectDB = async()=>{
    try{
        const connectionResponce = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log(`MONGODB connected !! DB HOST ${connectionResponce.connection.host}`)
    }catch(err){
        console.log("ERROR: ", err);
    }
}