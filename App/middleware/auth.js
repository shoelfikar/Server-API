const jwt = require('jsonwebtoken')

module.exports = {
  verifyToken : (req, res, next) => {
    // const token = req.headers['x-access-token']
    // try{
    //   jwt.verify(token, process.env.SECRET_KEY, (err,decoded)=> {
    //     if(decoded){
    //       console.log('success')
    //       next()
    //     }else{
    //       res.status(403).send({
    //         message: 'token expired'
    //       })
    //     }
    //   })
    // }catch{
    //   res.status(401).send({
    //     message: 'invailid authorozation!'
    //   })
    // }


    const bearerHeader = req.headers['authorization'];
    try {
      if(typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;
        jwt.verify(req.token, process.env.SECRET_KEY, (err,decoded)=> {
          if(decoded){
            console.log('success')
            next()
          }else{
            res.status(403).send({
              message: 'token expired'
            })
          }
        })
      } 
    } catch(error) {
      res.status(401).send({
        message: 'invailid authorozation!'
      })
    }
  }
}