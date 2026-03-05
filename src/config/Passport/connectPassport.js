const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const passport = require('passport');

require('dotenv').config();

const Users = require('../../app/Model/Users');

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_LOGIN_CLIENT_ID,
            clientSecret: process.env.GOOGLE_LOGIN_CLIENT_SECRET,
            callbackURL: '/api/auth/google/callback',
        },
        async function (accessToken, refreshToken, profile, cb) {
            if (!profile) {
                return cb(new Error('No profile found'), null);
            }
            const existingUser = await Users.findOne({
                $or: [
                    {
                        email: profile._json.email,
                    },
                    { provider_id: profile.provider },
                ],
            });
            if (!existingUser) {
                const profileName = profile._json.name.trim();
                // Thay thế khoảng trắng giữa các từ bằng không gian trống
                const username = await generateUsername({ profileName });
                const newUser = await saveUser({
                    username,
                    email: profile._json.email,
                    provider_id: profile.id,
                    avatar: { image_url: profile._json.picture },
                    first_name: profile._json.family_name,
                    last_name: profile._json.given_name,
                });
                const { password, ...other } = newUser._doc;
                return cb(null, other);
            }
            const { password, ...other } = existingUser._doc;
            return cb(null, other);
        },
    ),
);

passport.use(
    new FacebookStrategy(
        {
            clientID: process.env.FACEBOOK_APP_ID,
            clientSecret: process.env.FACEBOOK_APP_SECRET,
            callbackURL: '/api/auth/facebook/callback',
            profileFields: ['id', 'photos', 'email', 'displayName'],
        },
        async function (accessToken, refreshToken, profile, cb) {
            if (!profile) {
                return cb(new Error('No profile found'), null);
            }
            const existingUser = await Users.findOne({
                $or: [
                    { provider_id: profile.id },
                    { email: profile._json.email },
                ],
            });
            const [first_name, last_name] = profile.displayName.split(' ');
            if (!existingUser) {
                const profileName = profile._json.name.trim();
                // Thay thế khoảng trắng giữa các từ bằng không gian trống
                const username = await generateUsername({
                    num: 2,
                    profileName,
                });
                const newUser = await saveUser({
                    username,
                    email: profile._json.email,
                    provider: profile.provider,
                    provider_Id: profile.id,
                    avatar: {
                        public_id: '',
                        image_url: profile._json.picture,
                    },
                    first_name,
                    last_name,
                });

                const { password, ...other } = newUser._doc;
                return cb(null, other);
            }
            const { password, ...other } = existingUser._doc;
            return cb(null, other);
        },
    ),
);

//  function reused
const generateUsername = async ({ num = 6, profileName }) => {
    const { nanoid } = await import('nanoid');
    const newToken = nanoid(num).toUpperCase();
    const newUsername = `${profileName.replace(/\s+/g, '')}${newToken}`;
    return newUsername;
};

const saveUser = async ({
    username,
    email,
    provider_id,
    avatar,
    first_name,
    last_name,
}) => {
    const newUser = new Users({
        username,
        email,
        provider_id,
        avatar,
        first_name,
        last_name,
    });
    await newUser.save();
    return saveUser;
};
