import express from "express";
import {PrismaClient} from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

const maxItemCount = 10;


// ログイン状態のチェック
router.use((req, res, next) => {
    if (!req.user) {
        res.status(401).json({message: "ログインしてこい"});
        return;
    }
    next();
});

router.get("/list/:page?", async (req, res, next) =>{
    const page = req.query.page ? +req.query.page : 1;
    const skip = maxItemCount * (page - 1);

    const  [books, count] = await Promise.all([
        prisma.books.findMany({
            select: {id: true, title: true, author: true, rentals: true},
            skip,
            take: maxItemCount,
        }),
        prisma.books.count()
    ])
    const maxPageCount = Math.ceil(count / maxItemCount);
    res.status(200).json({books, maxItemCount: maxPageCount});
})

export default router;