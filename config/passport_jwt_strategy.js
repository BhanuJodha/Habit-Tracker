const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const JwtExtract = require("passport-jwt").ExtractJwt;
const env = require("./enviroment");
const User = require("../models/user");

passport.use(new JwtStrategy({
    secretOrKey: env.jwt_key,
    jwtFromRequest: JwtExtract.fromAuthHeaderAsBearerToken(),
    // Devlopment only
    ignoreExpiration: true
}, async (payload, done) => {
    try {
        const user = await User.findById(payload._id);
        if (user) {
            return done(null, user);
        }
        done(null, false);
    } catch (err) {
        console.log(err);
        done(err);
    }
}))

passport.serializeUser((user, done) => {
    done(null, user.id);
})

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        if (err){
            console.log(err);
            return done(err);
        }
        done(null, user);
    })
})