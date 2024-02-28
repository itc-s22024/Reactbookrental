import express from "express";
import {PrismaClient} from "@prisma/client";
import {check, validationResult} from "express-validator";

const router =  express.Router();
const prisma = new PrismaClient();

// 権限があるか確認
router.use((req, res, next) => {
    if (!req.user) {
        res.status(401).json({message: "ログインしてこい！！"});
    }
    if (!req.user.isAdmin) {
        res.status(401).json({message: "おまえ権限ないぞ", isAdmin: req.user.isAdmin});
    }
    next();
});

// 書籍の登録
router.post("/book/create", [
    check("isbn13").notEmpty({ignore_whitespace: true}),
    check("title").notEmpty({ignore_whitespace: true}),
    check("author").notEmpty({ignore_whitespace: true}),
    check("publishDate").notEmpty({ignore_whitespace: true}),
], async (req, res, next) => {
    if (!validationResult(req).isEmpty()) {
        res.status(400).json({message: "NG"});
    }
    try {
        const {isbn13, title, author, publishDate} = req.body
        await prisma.books.create({
            data: {
                isbn13,
                title,
                author,
                publishDate,
            }
        });
        res.status(201).json({result: "OK"});
    } catch (error) {
        res.status(400).json({result: "NG"});
    }
})

router.put("/book/update", async  (req, res, next) => {
    try {
        const {id,isbn13, title, author, publishDate} = req.body
        await prisma.books.update({
            where: {
                id: BigInt(id)
            },
            data: {
                id,
                isbn13,
                title,
                author,
                publishDate,
            }
        });
        res.status(200).json({result: "OK"});
    } catch (error) {
        res.status(400).json({result: "NG"})
    }
})

export default router;