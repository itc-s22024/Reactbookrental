import express from "express";
import {PrismaClient} from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

const maxItemcount = 10;


// ログイン状態のチェック
((req, res, next) => {
    if (!req.user) {
        // 未ログイン
        const err = new Error("ログインしてから出直してこい");
        err.status = 401;
        throw err;
    }
    // ログインできていれば次へ
    next();
});

router.get("/list/:page?", async (req, res, next) =>{
    const page = req.query.page ? +req.query.page : 1;
    const skip = maxItemcount * (page - 1);

    const  [books, count] = await Promise.all([
        prisma.books.findMany({
            select: {id: true, title: true, author: true, rentals: true},
            skip,
            take: maxItemcount,
        }),
        prisma.books.count()
    ])
    const maxPageCount = Math.ceil(count / maxItemcount);
    res.status(200).json({books, maxItemCount: maxPageCount});
})

export default router;