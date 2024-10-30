import mongoose from "mongoose";
require('dotenv').config();

export async function connectDatabase() {
    // const uri = "mongodb+srv://albindamn:albin381@gingercluster.tni02.mongodb.net/?retryWrites=true&w=majority&appName=gingercluster"
    const uri = process.env.DB
    if (uri) {
        await mongoose.connect(uri).then(
            () =>
                console.log("database connected")


        ).catch(error => {
            console.log("database error", error);
        });
    } else {
        console.log("not possible to connect");

    }

}       