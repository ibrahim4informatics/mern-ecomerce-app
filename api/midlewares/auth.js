const jwt = require("jsonwebtoken")
module.exports.auth = async (req, res, next) => {

    try {
        const token = req.headers.authorization.split(" ")[1]
        const info = await jwt.verify(token, process.env.SECRET)
        req.user_id = info
        next()
    }
    catch (err) {
        res.status(401).json({ message: "Not Authorized" });
    }

}