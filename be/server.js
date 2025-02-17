const express=require("express");
const cors=require("cors");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const connectToDb=require("./config/db");
const path=require("path");
const app=express();
// =======================================================
const UserSchema=require("./models/user");
const TodoSchema=require("./models/todo");
const { decode } = require("punycode");
// =======================================================

// Dot-Env
require("dotenv").config();
// Db SetUp
connectToDb();
// Middleware to parse json
app.use(express.json());
// Body Parsing Middleware  for application/x-www-form-urlencoded (forms), you might also want:
app.use(express.urlencoded({ extended: true }));
// CORS middleware
app.use(cors());
// Serving Static files on the server
app.use(express.static(path.join(__dirname, "../fe")));
// Initializing the PORT
const PORT=process.env.PORT||3000;
// =======================================================









// =======================================================
// Initializing an endpoint on the root 
app.get("/",(req,res)=>{
    return res.send("The server is up and running...");
});


// Signup Endpoint  ->Fe ->DB -> Tested
app.post("/user/signup",async (req,res)=>{
    const {username,email,password}=req.body;
    if(username && password && email){
        const hashedPassword=await bcrypt.hash(password,5);

        try{
            await UserSchema.create({
                username:username,
                email:email,
                password:hashedPassword
            });

            return res.status(201).send("The user has been successfully signed up.");
        }
        catch(err){
            console.error("There was a problem",err);
            return res.status(406).json({
               error:err.message
            })
        }
    }
    else{
        return res.status(406).send("Give the Valid username or password")
    } 
});


// Signin Endpoint ->Fe ->DB -> Tested
app.post("/user/signin",async(req,res)=>{
    const {username,password}=req.body;
 
        try{
            const response= await UserSchema.findOne({
                username:username
            });

            if(!response){
                return res.status(404).send("Username not found");
            }
            
            else{
                const matchPassword= await bcrypt.compare(password,response.password);

                if(matchPassword){
                    const token=jwt.sign({
                        userId:response._id
                    },process.env.JWT_USER,{expiresIn:"1h"});

                    return res.status(200).json({
                        token:token,
                        username:username,
                        email:response.email,
                        // userId:userId,
                        responseId:response._id
                        

                    });
                }
                else{
                    return res.status(404).send("Check the password and try again");
                }
            }
        }
        catch(err){
            return res.status(500).json({
                message:err.message,
                error:err
            })
        }
});


// ---------------------------------------------------------


// Middleware
app.use(['/todo/add','/todo/show','/todo/update','/todo/delete'],(req,res,next)=>{
    const {token}=req.headers;
    try{
        if(!token){
            return res.send("Token not available.Try signing in again");
        }
        else{
            const decodedtoken=jwt.verify(token,process.env.JWT_USER);
            if(decodedtoken){
                req.userId=decodedtoken.userId;
                // console.log("The decodedtoken is : ",decodedtoken);
                // console.log(req.userId);
                next();
            }
            else{
                return res.json({
                    message:"There was a problem decoding the token"
                })
            }
        }
    }
    catch(err){
        console.error("There was an error",err.message);
        return res.json({
            message:err.message
        })
    }
});

// See Todo -> Tested ->Db ->Be
app.get("/todo/show",async(req,res)=>{
    
    try{
        const response = await TodoSchema.find({
            userId:req.userId
        });
        console.log(req.userId)

        return res.json({
            message:"Successfully fetched all the Todos",
            userId:req.userId,
            todos:response
        })
    }
    catch(err){
        return res.json({
            error:err.message
        })
    }


});

// Add Todo -> Tested ->Db ->Be 
app.post("/todo/add",async (req,res)=>{
    const {desc}=req.body;
    if(!desc){
        return res.status(404).send("Description not found");
    }
    try{
        const response = await TodoSchema.create({
             description:desc,
             completed:false,
             userId:req.userId
        });

        return res.json({
            message:"The todo has been successfully added to the Db",
            response:response,
            userId:req.userId
        });
    }
    catch(err){
        return res.json({
            message:err.message
        })
    }
 
});

// Update Todo -> Tested ->Be ->Db
app.put("/todo/update/:id",async(req,res)=>{
    const {id}=req.params;
    const {updatedDesc}=req.body;
     try{
        const response=await TodoSchema.findOneAndUpdate(
           {_id:id},
           {description:updatedDesc},
           {new:true}
        );

        return res.json({
            message:"Successfully Updated the Todo",
            response:response
        })
     }
     catch(err){
        return res.json({
            error:err.message
        })
     } 
});

// Delete Todo
app.delete("/todo/delete/:id",async (req,res)=>{
    const {id}=req.params;
     try{
        const response1= await TodoSchema.find({_id:id});
        if(!response1){
            return res.status(404).json({
                message:`Can not find the id ${id}`,
                Response:response1
            })
        }
        else{
            const response2= await TodoSchema.deleteOne({_id:id});
            return res.json({
                message:"Successfully deleted the Todo",
                Response:response2
            });
        }
     }
     catch(err){
        return res.json({
            error:err.message
        })
     }
 
});


app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
