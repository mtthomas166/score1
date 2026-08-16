const express=require('express');
const router=express.Router();
const authController=require('./../Controller/authController')
router.route('/signUp').post(authController.signUp);
router.route('/logIn').post(authController.logIn);
router.route('/logOut').get(authController.protect,authController.logOut)
router.route('/forgetPassword').post(authController.resetPassword);
router.route('/resetPassword/:resetToken').patch(authController.forgetPassword);
module.exports=router; 