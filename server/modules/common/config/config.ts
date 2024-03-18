import { DATABASE_CONFIGURATION } from "./config.types";

require('dotenv').config();

export const getDatabaseConfiguration: () => DATABASE_CONFIGURATION = 
() => {
    if (!process.env.DATABASE_USERNAME){
        throw new Error("db must be defined")
    }
    return {
        USERNAME: process.env.DATABASE_USERNAME!,
        PASSWORD: process.env.DATABASE_PASSWORD!,
        DB: process.env.DB!
    }
        
}

export const getPORT = () => {
    return process.env.PORT || 3000
}