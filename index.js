import express from 'express'
import cors from 'cors'
import passport from 'passport'
import session from 'express-session'
import dotenv from 'dotenv'
import appRoutes from './src/routes/index.js'
import MongoStore from 'connect-mongo'
import './src/utlis/passport.js'


dotenv.config()

const app=express()

const PORT=process.env.PORT

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))
app.use(express.json())
app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: { secure:false, httpOnly: true,  maxAge: 1000 * 60 * 60 },
    })
  );
 app.use(passport.initialize())
 app.use(passport.session()) 
 
  
app.use('/',appRoutes)


app.listen(PORT,()=>console.log(`app is listening port ${PORT}`))

