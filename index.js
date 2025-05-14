const express = require("express")
const app=express();
// const middleware=require("./middleware.js")
// const cors = require("cors")
// app.use(cors());
const mainRouter = require("./routes/index");
app.use(express.json());


app.use("/api/v1", mainRouter);

// app.use("/api/v2",v2router);



app.listen(3000,()=>{
    console.log("app is listening on port 3000")
});