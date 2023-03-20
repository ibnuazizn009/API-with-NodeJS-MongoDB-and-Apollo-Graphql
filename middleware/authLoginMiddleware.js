const jwt = require('jsonwebtoken');
const usersModel = require('../codex/models/users');

module.exports = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader){
        req.isAuth = false;
        return next();
    }
    
    const token = authHeader.split(' ')[1];
    // console.log(token);
    if (!token){
        req.isAuth = false;
        return next();
    }
    let decodedToken;
    try {
        await jwt.verify(token, 'somesecretkey', function(err, decoded){
            if(err){
                console.log(err)
            }else{
                console.log(decoded);
            }
        });
    } catch (err) {
        req.isAuth = false;
        return next();
    }

    // let authUser = await usersModel.findById(decodedToken.userId);
    console.log(decodedToken)
    // if(!authUser){
    //     req.isAuth = false;
    //     return next();
    // }

    // req.user = authUser;
    // req.isAuth = true;
    return next();
}