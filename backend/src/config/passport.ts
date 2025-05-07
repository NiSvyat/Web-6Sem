import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt, StrategyOptions, VerifiedCallback } from 'passport-jwt';
import db from '../models'; // Теперь с правильными типами

const JWT_SECRET = 'MyJWT';

interface JwtPayload {
  id: number;
}

const options: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWT_SECRET
};

passport.use(new JwtStrategy(options, async (jwtPayload: JwtPayload, done: VerifiedCallback) => {
  try {
    const user = await db.User.findByPk(jwtPayload.id);

    if (user) {
      // user также будет типизирован
      console.log(user.username); // Автодополнение будет работать
      return done(null, user);
    }
    return done(null, false);
  } catch (err) {
    return done(err, false);
  }
}));

export default passport;