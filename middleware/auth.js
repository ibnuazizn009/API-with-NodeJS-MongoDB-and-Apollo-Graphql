const jwt = require('jsonwebtoken');
const usersModel = require('../codex/models/users');

module.exports = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if(!authHeader){
        req.isAuth = false;
        return next();
    }

    const token = authHeader.split(' ')[1];

    if(!token){
        req.isAuth = false;
        return next();
    }

    let decodedToken;
    try{
        jwt.verify(token, 'somesecretkey', function(err, decoded){
            if(err){
                console.log(err)
            }else{
                decodedToken = decoded;
            }
        })
    }catch(err){
        req.isAuth = false;
        return next();
    }
    
    console.log(decodedToken);
    req.isAuth = true;
    req.userId = decodedToken.userId;
    return next();
}