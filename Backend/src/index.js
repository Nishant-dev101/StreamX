
import dotenv from "dotenv";
dotenv.config();
import { connectDB } from "./db/index.js"
import app from "./app.js"

// asyn method returns promise
connectDB()
.then( ()=> {

    app.listen(process.env.PORT || 4000 , () => {
        console.log("port running on ",process.env.PORT);
        
    })
})
