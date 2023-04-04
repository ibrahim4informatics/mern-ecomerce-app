/* db integrations => controller depend */
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")
const SECRET = process.env.SECRET
const transporter = require('../functions/nodemailer')
const fs = require('fs')
const path = require('path')



/** POST http://localhost:3001/seller/register */
module.exports.regiserSeller = async (req, res) => {
    const { name, email, phone, password, confirm } = req.body

    if (!name || !email || !phone || !password || !confirm) return res.status(400).json({ message: "fill all fields" })

    let userExist;
    let phoneUsed;
    try {
        const _user = await prisma.user.findUnique({ where: { phone } })
        const user = await prisma.user.findUnique({ where: { email } })
        if (_user) phoneUsed = true
        else phoneUsed = false
        if (user) userExist = true;
        else userExist = false;
    } catch (err) {
        throw new Error(err)
    }
    if (phoneUsed) return res.status(400).json({ message: "phone is used" })
    if (userExist) return res.status(400).json({ message: "email is used" });
    if (phone.length != 10) return res.status(400).json({ message: "invalid phone number" })
    if (password !== confirm) return res.status(400).json({ message: "password doesn't match" })
    if (password.length < 8) return res.status(400).json({ message: "password too short" })

    try {
        await prisma.user.create({ data: { name, email, phone, password: bcrypt.hashSync(password, 10) } })
        return res.status(201).json({ message: "user created, login now" })
    }
    catch (err) {
        return res.status(500).json({ message: (err || "Unkown Error") })
    }

}

/** POST http://localhost:3001/seller/login */
module.exports.loginSeller = async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) return res.status(400).json({ message: "fill all fields" })

    try {
        const user = await prisma.user.findUnique({ where: { email } })
        if (!user) return res.status(404).json({ message: "invalid email" })
        if (!(bcrypt.compareSync(password, user.password))) return res.status(401).json({ message: "invalid password" });
        const token = jwt.sign({ id: user.id }, SECRET, { expiresIn: "24h" })
        return res.status(200).json({ message: "login successfully", token })

    }
    catch (err) {
        return res.status(500).json({ message: "login failed" })
    }


}

/** POST http://localhost:3001/seller/product/new */
module.exports.createProduct = async (req, res) => {
    const { title, price, description, stock } = req.body
    const user_id = req.user_id.id

    // upload image for product
    const images = req.files
    if (!images) return res.status(400).json({ message: "image is required" })
    const image = req.files.image
    const image_name = Date.now().toString() + image.name
    image.mv(`./public/images/${image_name}`, (err => { if (err) console.log(err) }))
    const image_server_path = `http://localhost:3001/images/${image_name}`

    try {
        const user = await prisma.user.findUnique({ where: { id: user_id } })

        if (user.isAdmin) {
            try {
                const newProduct = await prisma.products.create({
                    data: {
                        title, price: Number.parseFloat(price), description, stock: Number.parseInt(stock), image: image_server_path, user_id: user_id,
                        isApprouved: true,
                    }
                })
                return res.status(201).json({ mesage: "product added", product: newProduct })

            } catch (err) {
                return res.status(500).json({ message: err || "unkonwn error" })
            }
        }
        else {
            try {
                const newProduct = await prisma.products.create({
                    data: {
                        title, price: Number.parseFloat(price), description, stock: Number.parseInt(stock), image: image_server_path, user_id: user_id,
                    }
                })
                return res.status(201).json({ mesage: "product added", product: newProduct })

            } catch (err) {
                return res.status(500).json({ message: err || "unkonwn error" })
            }
        }
    }

    catch (err) {
        res.status(500).json({ message: err || "Unknown Error" })
    }

}

/* delete seller product DELETE http://localhost:3001/api/seller/product/delete/productid */
module.exports.deleteProduct = async (req, res) => {
    const { product_id } = req.params;
    const _user = req.user_id
    const user_id = _user.id

    const user = await prisma.user.findUnique({ where: { id: user_id } })

    // check if user admin or not

    if (user.isAdmin) {
        // if admin delete any product 
        try {
            const product = await prisma.products.findUnique({ where: { id: product_id } })
            const product_image_url = await product.image
            const image_path = await product_image_url.slice(7)
            const image_name = await image_path.split("/")[2]
            await prisma.products.delete({ where: { id: product_id } })
            await fs.unlinkSync(`./public/images/${image_name}`)
            return res.status(200).json({ message: "product deleted" })
        }
        catch (err) {
            console.log(err)
            return res.status(500).json({ message: err || 'unkown error' })
        }
    }
    else {
        // if not admin delete just own product
        try {
            const productToDelete = await prisma.products.findUnique({ where: { id: product_id } })
            // check if user is the owner
            if (productToDelete.user_id !== user_id) return res.status(401).json({ message: "not authorized to delete this product" })
            const product = await prisma.products.findUnique({ where: { id: product_id } })
            const product_image_url = await product.image
            const image_path = await product_image_url.slice(7)
            const image_name = await image_path.split("/")[2]
            await prisma.products.delete({ where: { id: product_id } })
            await fs.unlinkSync(`./public/images/${image_name}`)
            return res.status(200).json({ message: "product deleted" })
        } catch (err) {
            return res.status(500).json({ message: err.meta.cause || "unkown error" })
        }
    }
}

/**  get all user products  GET http://localhost:3001/api/products */
module.exports.getProducts = async (req, res) => {
    const _user = req.user_id;
    const user_id = _user.id;
    try {

        const user = await prisma.user.findUnique({ where: { id: user_id } })
        // admin all product = user products && other users products
        if (user.isAdmin) {
            try {

                const allProducts = await prisma.products.findMany()
                let ownProduct = [];
                let othersProducts = [];

                allProducts.forEach(product => {
                    if (product.user_id === user_id) {
                        ownProduct.push(product)
                    }
                    else {
                        othersProducts.push(product)
                    }
                })

                return res.status(200).json({ ownProduct, othersProducts, user })


            }
            catch (err) {
                return res.status(500).json({ message: err || "Unkown Error" })
            }
        }
        // not admin just own products
        else {

            try {
                const approved_Products = await prisma.products.findMany({ where: { user_id, isApprouved: true } });
                const pendingProducts = await prisma.products.findMany({ where: { user_id, isApprouved: false } });
                return res.status(200).json({ approved_products: approved_Products, pending_products: pendingProducts, user })

            }
            catch (err) {
                return res.status(500).json({ message: err || "Unkown Error" })
            }

        }
    }
    catch (err) {
        return res.status(500).json({ message: err })
    }


}

/** make product approuved  PUT http://localhost:3001/api/seller/product/aprouve/:id */
module.exports.setApprouved = async (req, res) => {
    const user = await prisma.user.findUnique({ where: { id: req.user_id.id } })
    if (!user.isAdmin) return res.status(401).json({ message: "Not Authorized" })

    try {
        const product = await prisma.products.findUnique({ where: { id: req.params.product_id } })
        if (product.isApprouved) return res.status(400).json({ message: "product already approuved" })
        try {
            await prisma.products.update({ where: { id: req.params.product_id }, data: { isApprouved: true } })
            res.status(200).json({ message: "product approuved" })
        }
        catch (err) {
            res.status(500).json({ message: err.meta.cause || "Unkown Error" })
        }
    }
    catch (err) {
        res.status(500).json({ message: err.meta.cause || "Unkown Error" })
    }
}

/** make product banned or not PUT http://localhost:3001/api/seller/product/aprouve/:id */
module.exports.setBanned = async (req, res) => {
    const user = await prisma.user.findUnique({ where: { id: req.user_id.id } })
    if (!user.isAdmin) return res.status(401).json({ message: "Not Authorized" })

    try {
        const product = await prisma.products.findUnique({ where: { id: req.params.product_id } })
        if (!(product.isApprouved)) return res.status(400).json({ message: "product already banned" })
        try {
            await prisma.products.update({ where: { id: req.params.product_id }, data: { isApprouved: false } })
            res.status(200).json({ message: "product banned" })
        }
        catch (err) {
            res.status(500).json({ message: err.meta.cause || "Unkown Error" })
        }
    }
    catch (err) {
        res.status(500).json({ message: err.meta.cause || "Unkown Error" })
    }
}

/** POST http://localhost:3001/api/seller/reset Reset Password  */
module.exports.getResetAccess = async (req, res) => {
    const { email } = req.body

    // check if user doen't exist 
    const _user = prisma.user.findUnique({ where: { email } })
    if (!_user) return res.status(404).json({ message: "user doesnt exist" })
    try {
        const token = await jwt.sign({ email }, process.env.RESET_SECRET, { expiresIn: "15m" })
        const reset_url = `http://localhost:3001/api/seller/reset?key=${token}`

        let emailMessage = {
            from: `"Shop DZ 🛒" <${process.env.EMAIL}>`, // sender address
            to: email, // list of receivers
            subject: "RESET PASSWORD ✔", // Subject line
            text: "URL for reset password", // plain text body
            html:
                `
                <h1 style="color:#845EC2; text-align: center; margin-bottom: 20px;">HELLO SELLER ${email.split("@")[0]}</h1>
                <h3 style="margin-bottom:20px; color:#4B4453">you forgot your password and you choose to reset it with this option</h3>
                <p style="color:#B0A8B9;">you can reset your password with this link:</p>
                <a style="margin:10px; padding:4px 12px; background-color:#845EC2; color:#FCF7FF; text-decoration:none; border-radius:4px" href="${reset_url}">RESET PASSWORD</a>

            `,
        }

        try {
            let info = await transporter.sendMail(emailMessage);

            res.status(200).json({ message: "email sent" })
        }
        catch (err) {
            res.status(500).json({ err })
        }




    }
    catch (err) {
        res.status(500).json({ message: err })
    }
}
/**
 * user loss his password
 * go to this endpoint of the api
 * pass his email
 * we will check if we have user with the email passed
 * if not exist return error
 * if exist send an url in his email with specifique query
 * passing 15 minute valid token to this url with his email
 * send this url to the user by email http://localhost:3001/reset?=token 
 * 
*/
/** PUT http://localhost:3001/api/seller/reset?=token UPDATE USER PASSWORD */



// GET http://loclahost:3001/api/seller/pending
module.exports.getPending = async (req, res) => {


    try {
        const user = await prisma.user.findUnique({ where: { id: req.user_id.id } })
        if (user.isAdmin === true) {
            const pending = await prisma.products.findMany({ where: { isApprouved: false } })
            return res.status(200).json({ pending, user })
        }
        return res.status(401).json({ message: "not authorized" })
    }
    catch (err) {
        return res.status(500).json({ message: "Unknown Error" })
    }
}