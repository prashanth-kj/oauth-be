
import mongoose from './index.js'

const userSchema= new mongoose.Schema({
       
     name:{
           type:String,
           required:[true, 'name is required']
      },
      email:{
           type:String,
           required:[true,'email  is required']
      },
      password:{
           type:String,
          
      },
      provider:[String],
      googleId: {
          type: String,
      },
      githubId:{
          type:String
      }
},{
   collection:'customers',
   versionKey:false
})

const userModel= mongoose.model('customers',userSchema)

export default userModel
