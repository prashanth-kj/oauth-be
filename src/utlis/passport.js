import passport from "passport";
import {Strategy as GoogleStrategy} from "passport-google-oauth20";
import {Strategy as GithubStrategy} from "passport-github2"
import userModel from '../model/user.js';
import dotenv from 'dotenv';
dotenv.config();

passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Safely extract email if available

      const { emails, displayName,id,provider } = profile;

      const email = emails && emails.length > 0 ? emails[0].value : null;

      if (!email) {
        return done(new Error('Email is required'), null);
      }
      const user = await userModel.findOne({email});
        // console.log(user)
      if (user) {
        if(!user.googleId){
           user.googleId=id;
           user.provider=user.provider.includes('google')? user.provider : [...user.provider, provider]
           await user.save()
        }
        return done(null, user); // User found, proceed
      } else {
        // Create a new user
        const newUser = await userModel.create({
            name: displayName,
            email,
            provider:[provider],
            googleId: id,
        });
       
        return done(null, newUser); // New user created, proceed
      }
    } catch (error) {
      console.error("Error during authentication:", error);
      return done(error, null); // Handle error if something goes wrong
    }
  }
));

passport.use(new GithubStrategy(
  {
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK_URL,
  },
  async (accessToken, refreshToken, profile, done) => {
    try {

         let {username,id,provider}=profile
         
         if (!accessToken) {
          return done(new Error('Access token is missing or invalid'), null);
        }
        
      const response = await fetch('https://api.github.com/user/emails', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

      let emails= await response.json()
      let email = await emails.find((e)=>e.primary).email
    
      if (!email) {
          return done(new Error('Email is required'), null);
         }

       // Check if user already exists
       const user = await userModel.findOne({ email });  

       if (user) {
          
        if(!user.githubId){
          user.githubId=id;
          user.provider= user.provider.includes('github')?user.provider : [...user.provider,provider]
          await user.save()
        }
        
          return done(null, user);  // User found, proceed
        } else {
          // Create a new user
          const newUser = await userModel.create({
            name: username,
            email,
            provider:[provider],
            githubId: id,
          });
  
          return done(null, newUser);  // New user created, proceed
        }
    } catch (error) {
      console.error("Error during authentication:", error);
      return done(error, null); // Handle error if something goes wrong
    }
  }
));


// Serialize the user to store in the session
passport.serializeUser((user, done) => {
  // console.log("serialize user:" + user)
   done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    //  console.log('deserialize user: ' + id)
     let user = await userModel.findOne({_id:id})
    if (!user) {
      return done(new Error("User not found"), null); 
    }
    done(null, user);  
  } catch (error) {
    done(error, null);  
  }
});