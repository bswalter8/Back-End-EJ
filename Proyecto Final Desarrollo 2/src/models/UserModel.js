import mongoose from "mongoose";

 const UserLogIn = mongoose.model('User', {
     username: String,
     password: String,
     email: String,
     address: String,
     cellphone: String,
     age: String,
 });

 const UserRole = mongoose.model('UserRole', {
    userName: { type: String, required: true },
    role: { type: String, required: true },
});

 export  {UserLogIn, UserRole};


