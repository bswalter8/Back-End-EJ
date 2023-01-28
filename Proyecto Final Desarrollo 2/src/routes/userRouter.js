import express from 'express';
import passport from 'passport';
import {upload} from '../middleware/upoladImg.js'
import {checkAuthentication} from '../middleware/auth.js'
import {auth,soloAdmins} from '../controllers/loginController.js'
import { //getRoot,
   // redirect,
  //  getLogin,
    postLogin,
    getFailLogin,
 //   getLogout,
  //  getSignUp,
    postSignup,
   // getFailsignup,
    createCart,
    createUserRole,
    checkAdmin,
    isUploadImg,
  //  auth 
        } from '../controllers/loginController.js'



        const { Router } = express;
        const userRouter = new Router();

        //TOKEN TEST 
   /*     userRouter.get('/token', auth, (req,res)=>{
            res.send('Token valido')
        });*/

        userRouter.get('/isAdmin', auth,soloAdmins,checkAdmin);

        //LOGIN

      //  userRouter.get('/login', getLogin);

        userRouter.post('/login', passport.authenticate('login', {
            failureRedirect: '/faillogin',
           // failureMessage: true 
        }), postLogin);


        userRouter.get('/faillogin', getFailLogin);

        

        //SIGNUP


     //   userRouter.get('/signup', getSignUp);

      /*  userRouter.post('/signup', upload.single('img'), isUploadImg, passport.authenticate('signup', {
           // failureRedirect: '/failsignup'
           failureMessage: true 
        }), createCart, postSignup);*/

        userRouter.post('/signup', passport.authenticate('signup', {
           // failureRedirect: '/failsignup'
           failureMessage: true,
            
        }),  createCart, createUserRole, postSignup);


         /*     userRouter.post('/signup', passport.authenticate('signup', {
            failureRedirect: '/failsignup'
            }), createCart, postSignup);*/


      //  userRouter.get('/failsignup',getFailsignup);


        //LOGOUT
    //    userRouter.get('/logout', getLogout);

export {userRouter}