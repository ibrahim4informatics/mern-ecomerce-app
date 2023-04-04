const express = require('express');
const router = express.Router();
const jwt = require("jsonwebtoken")

// db integrations => controller depend
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()





// controllers 
const sellerContoller = require('../controllers/sellerController')

// midleware
const anonym = require("../midlewares/anonym").anonym
const auth = require('../midlewares/auth').auth
const resetVerifier = require("../midlewares/resetVerfier")
// authentication and authorization routes

/* POST http://localhost:3001/api/seller/register  register seller */
router.post('/register', anonym, sellerContoller.regiserSeller)

/* POST http://localhost:3001/api/seller/login  login seller */
router.post('/login', anonym, sellerContoller.loginSeller)


/* 
    normale seller routes => add product + delete own product + delete own account + update own product 
    admin seller routes => normale seller routes + delete products + accept products + delete seller + make seller to admin 

    dashboard functionality
*/



/** create product POST http://localhost:3001/api/seller/product/new */
router.post('/product/new', auth, sellerContoller.createProduct)

/**  get all user products  GET http://localhost:3001/api/products */
router.get("/products", auth, sellerContoller.getProducts)

/** update product  PUT http://localhost:3001/api/seller/product/edit/product_id */
router.put("/product/edit/:product_id", auth, async (req, res) => {
    const { title, price, description, stock } = req.body;
    const _user = req.user_id;
    const id = _user.id;
    const { product_id } = req.params;

    try {
        // the seller can edit his own products
        const productToEdit = await prisma.products.findUnique({ where: { id: product_id } });
        if (productToEdit.user_id !== id) return res.status(401).json({ message: "Not Authorized to Edit This Product" })
        try {
            await prisma.products.update({ where: { id: product_id }, data: { title, price: Number.parseFloat(price), description, stock: Number.parseInt(stock) } });
            return res.json({ message: "Producte editted" })
        } catch (err) {
            return res.status(500).json({ message: err.meta.cause || "Unkown Error" })
        }

    } catch (err) {
        return res.status(500).json({ message: err.meta.cause || "Unkown Error" })
    }

})

/* delete seller product DELETE http://localhost:3001/seller/product/delete/productid */
router.delete('/product/delete/:product_id', auth, sellerContoller.deleteProduct)


/** make product approuved  PUT http://localhost:3001/api/seller/product/aprouve/:id */
router.put('/product/approuve/:product_id', auth, sellerContoller.setApprouved)


/** make product banned or not PUT http://localhost:3001/api/seller/product/aprouve/:id */
router.put('/product/ban/:product_id', auth, sellerContoller.setBanned)

/** POST http://localhost:3001/api/seller/reset get access to reset password */
router.route("/reset").post(sellerContoller.getResetAccess)
router.get('/reset', resetVerifier, async (req, res) => {
    const key = req.query.key
    res.cookie('reset_token', key)
    res.render("reset.ejs")
});

router.post("/reset/update", async (req, res) => {
    const { password, confirm } = req.body
    const jwt = require('jsonwebtoken')
    const bcrypt = require('bcrypt')
    const { email } = await jwt.verify(req.cookies.reset_token, process.env.RESET_SECRET)

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ message: "No User Found!" })

    if (password !== confirm) return res.status(400).json({ err: "passwords doesn't match!" })
    if (password.length < 8) return res.status(400).json({ err: "password short!" })

    try {
        const hash = await bcrypt.hashSync(password, 10)
        await prisma.user.update({ where: { email }, data: { password: hash } })
        return res.send("<h1>Password Changed</h1>")

    }
    catch (err) {
        return res.status(500).json({ err })
    }

})
module.exports = router

router.get("/pending", auth, sellerContoller.getPending)
// hcgvsxmyjodyhmdc