const public = require('./public');
const user = require('./User');
const admin = require('./Admin');
const auth = require('./auth');
const api = require('./api');
const JwtMiddleware = require('../app/Middleware/JwtMiddleware');
const route = (app) => {
    // router user
    app.use(
        '/user',
        JwtMiddleware.verifyAccessToken,
        JwtMiddleware.verifyUserLocked,
        user,
    );
    // router admin
    app.use(
        '/admin',
        JwtMiddleware.verifyAccessToken,
        JwtMiddleware.verifyUserLocked,
        JwtMiddleware.verifyRoleUser('Admin'),
        admin,
    );
    // router auth
    app.use('/auth', auth);
    // router api
    app.use('/api', api);
    // routes without login
    app.use('/', public);
};

module.exports = route;
