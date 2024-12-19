import express from 'express'
import passport from 'passport';
import {logout, getCurrentUser} from '../controller/auth.js'

const router = express.Router()

router.get('/google', passport.authenticate('google', { scope: ['profile','email'] }));

router.get('/google/callback', 

    passport.authenticate('google', {  
        successRedirect: "https://gregarious-youtiao-7ffe0c.netlify.app/home",
        failureRedirect: "https://gregarious-youtiao-7ffe0c.netlify.app", }),
);
  
router.get('/github', passport.authenticate('github', { scope: ['user, user:email'] }));

router.get('/github/callback', 

    passport.authenticate('github', {  
        successRedirect: "https://gregarious-youtiao-7ffe0c.netlify.app/home",
        failureRedirect: "https://gregarious-youtiao-7ffe0c.netlify.app", }),
);
  

router.get("/logout", logout);
router.get("/currentuser", getCurrentUser);



export default router