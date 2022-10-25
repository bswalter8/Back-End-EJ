import mongoose from "mongoose";

 const UserLogIn = mongoose.model('User', {
     username: String,
     password: String,
     email: String,
     firstName: String,
     lastName: String
 });

 export default UserLogIn;