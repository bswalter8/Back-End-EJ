import { Strategy as LocalStrategy } from "passport-local";
import passport from "passport";
import { UserLogIn as User, UserRole } from "../models/UserModel.js";
import bCrypt from "bcrypt";

const registerStrategy = new LocalStrategy(
  {
    passReqToCallback: true,
  },
  (req, username, password, done) => {
    User.findOne({ username: username }, (err, user) => {
      if (err) {
        return done(err);
      }

      if (user) {
        return done(null, false, { message: "El usuario ya existe" });
      }

      const newUser = {
        username: username,
        password: createHash(password),
        email: req.body.email,
        address: req.body.address,
        cellphone: req.body.cellphone,
        age: req.body.age,
        role: "user",
      };

      User.create(newUser, (err, userWithId) => {
        if (err) {
          return done(err);
        }

        return done(null, userWithId);
      });
    });
  }
);

const loginStrategy = new LocalStrategy((username, password, done) => {
  User.findOne({ username }, (err, user) => {
    if (err) {
      return done(err);
    }

    if (!user) {
      return done(null, false);
    }

    if (!isValidPassword(user, password)) {
      return done(null, false);
    }

    return done(null, user);
  });
});

function createHash(password) {
  return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}

function isValidPassword(user, password) {
  return bCrypt.compareSync(password, user.password);
}

function checkAuthentication(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/login");
  }
}

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, done);
});

export { registerStrategy, loginStrategy, checkAuthentication };
