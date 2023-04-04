const jwt = require('jsonwebtoken')


module.exports.anonym = async (req, res, next) => {
    const token = req.headers.authorization
    if (token == undefined) { next() }
    else {
        try {
            await jwt.verify(token.split(" ")[1], process.env.SECRET)
            return res.status(403).json({ message: "user already logged in" })
        }
        catch {
            next()
        }
    }


}