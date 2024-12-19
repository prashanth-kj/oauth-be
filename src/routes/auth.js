import express from 'express'
import passport from 'passport';
import {logout, getCurrentUser} from '../controller/auth.js'

const router = express.Router()

router.get('/google', passport.authenticate('google', { scope: ['profile','email'] }));

router.get('/google/callback', 

    passport.authenticate('google', {  
        successRedirect: "http://localhost:5173/home",
        failureRedirect: "http://localhost:5173", }),
);
  
router.get('/github', passport.authenticate('github', { scope: ['user, user:email'] }));

router.get('/github/callback', 

    passport.authenticate('github', {  
        successRedirect: "http://localhost:5173/home",
        failureRedirect: "http://localhost:5173", }),
);
  

router.get("/logout", logout);
router.get("/currentuser", getCurrentUser);



export default router