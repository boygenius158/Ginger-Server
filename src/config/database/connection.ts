import mongoose from "mongoose";

export async function connectDatabase(){
    await mongoose.connect("mongodb://127.0.0.1:27017/ginger").then(
        () =>
         console.log("database connected") 
        
        
    ).catch(error => {
        console.log("database error", error);
    });
    
}