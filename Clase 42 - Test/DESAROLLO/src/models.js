import mongoose from "mongoose";

 const UserLogIn = mongoose.model('User', {
     username: String,
     password: String,
     email: String,
     address : String,
     cellphone: String,
     age: String,
 });

 export default UserLogIn;



