const mongoose=require("mongoose");
const connectToDb=async ()=>{
    try{
        mongoose.connect(process.env.MongoDb_url);
        console.log("Connected to the Database");
    }
    catch(err){
        console.log("There was a problem connecting to the database",err);
    }
}

module.exports=connectToDb;