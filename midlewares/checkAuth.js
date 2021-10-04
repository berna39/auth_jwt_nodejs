const jwt = require('jsonwebtoken');

module.exports = function checkAuth(req,resp,next){
    const token = req.header('auth-token');
    if(!token){
        resp.status(401).send('Access denied');
    } else {
        try {
            const verified = jwt.verify(token,process.env.TOKEN_SECRET);
            req.user = verified;
            next();
        } catch (error) {
            resp.status(500).send(error);
        }
    }
}