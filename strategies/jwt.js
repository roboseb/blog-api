const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRET_KEY;

module.exports = new JwtStrategy(opts, (jwt_payload, done) => {

    User.findOne({username: jwt_payload.username}, (err, results ) => {
        if (err) return next(err);
    
        if (results === null) {
            return done(null, false)
        } else {
            return done(null, true)
        }
    });
}) 
