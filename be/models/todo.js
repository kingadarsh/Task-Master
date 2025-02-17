const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const ObjectId=mongoose.ObjectId;

const TodoSchema=new Schema({
    description:{
        required:true,
        trim:true,
        type:String
    },
    completed:{
        type:Boolean
    },
    userId:ObjectId
});

const TodoModel=mongoose.model("todos",TodoSchema);

module.exports=TodoModel;