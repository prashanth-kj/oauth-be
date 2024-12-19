import userModel from "../model/user.js";
import Auth from '../utlis/auth.js'


const createUser=async(req,res)=>{
   try {
    
            let {name,email,password} = req.body;

            if(name && email && password){
                req.body.password = await Auth.hashPassword(req.body.password) 
                let user = new userModel({
                    name,
                    email,
                    password:req.body.password
                })
                 user.provider=["local"]
                 await user.save()
                res.status(201).send({
                    message:"user created sucessfully",
                    user
                })
                
            }
            else{
                res.status(400).send({
                    message:"All data field is required"
                }) 
            }

   } catch (error) {
       console.log(error); 
       res.status(500).send({
          message:"Internel Server error"
       })
   } 
}

const login=async(req,res)=>{
      
       try {
             
        let user = await userModel.findOne({email:req.body.email})
         if(user){
              let hashCompare= await Auth.hashCompare(req.body.password,user.password)
            if(hashCompare){
                   let token = await Auth.createToken({
                      id:user._id,
                      name:user.name,
                      provider:user.provider
                   })

                  res.status(201).send({
                     message:"Login sucessfull",
                     user,
                     token
                  })
            }else{
                res.status(404).send({
                    message:"password does not match"  
                }) 
            }
         }else{
            res.status(404).json({
                message:`Account with ${req.body.email} does not exists `
            })
         }
       } catch (error) {
            console.log(error); 
            res.status(500).send({
            message:"Internel Server error"
            })
       }
}

const getuserById=async(req,res)=>{
    try {
         let userId= req.headers.userId;
         let user = await userModel.findById({_id:userId})
         
         res.status(200).send({
            message:"user data fetched sucessfully",
            user
         })
    } catch (error) {
        
        console.log(error)
    }
}
export default {
      createUser,
      login,
      getuserById
}