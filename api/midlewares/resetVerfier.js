const jwt = require('jsonwebtoken')
const resetVerifier = async (req, res, next) => {
    try {
        const token = req.query.key
        const info = await jwt.verify(token, process.env.RESET_SECRET)
        req.email = info
        next()
    }
    catch (err) {
        res.status(401).json({ message: err || "expired not authorized", hint: "try to reset your password again" });
    }
}
module.exports = resetVerifier
