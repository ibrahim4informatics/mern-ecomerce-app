const express = require('express');
const router = express.Router();

// functions


const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// get all rpoducts
router.get("/products", async (req, res) => {
    const allProducts = await prisma.products.findMany({ where: { isApprouved: true }, include: { user: true } })


    res.status(200).json({ message: "all products", allProducts })
})


// search product
router.get('/products/search', async (req, res) => {
    const { keyword } = req.query

    try {
        const searchedProduct = await prisma.products.findMany({
            where: {
                isApprouved: true,
                title: {
                    contains: keyword,
                }
            },
            include: { user: true }
        })
        if (searchedProduct.length === 0) return res.status(404).json({ message: "product not found" })
        return res.status(200).json({ searchedProduct })
    }
    catch (err) {
        return res.status(500).json({ message: err })
    }
})


// get single product
router.get("/products/:id", async (req, res) => {
    const { id } = req.params
    try {
        const product = await prisma.products.findUnique({ where: { id }, include: { user: true } })
        if (!product || product.isApprouved != true) return res.status(404).json({ message: "product not found" })
        return res.status(200).json({ product })
    }
    catch (err) {
        return res.status(500).json({ message: err })
    }

})



module.exports = router