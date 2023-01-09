import express from 'express';
import passport from 'passport';
import {upload} from '../middleware/upoladImg.js'
import {checkAuthentication} from '../middleware/auth.js'
import { getRoot,
    redirect,
    getLogin,
    postLogin,
    getFailLogin,
    getLogout,
    getSignUp,
    postSignup,
    getFailsignup,
    createCart,
    isUploadImg 
        } from '../controllers/loginController.js'



        const { Router } = express;
        const userRouter = new Router();


        //LOGIN

        userRouter.get('/login', getLogin);

        userRouter.post('/login', passport.authenticate('login', {
            failureRedirect: '/faillogin'
        }), postLogin);


        userRouter.get('/faillogin', getFailLogin);



        //SIGNUP


        userRouter.get('/signup', getSignUp);

        userRouter.post('/signup', upload.single('img'), isUploadImg, passport.authenticate('signup', {
            failureRedirect: '/failsignup'
        }), createCart, postSignup);


        userRouter.get('/failsignup',getFailsignup);


        //LOGOUT
        userRouter.get('/logout', getLogout);

export {userRouter}