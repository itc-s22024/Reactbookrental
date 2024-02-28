import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import session from "express-session";
import passport from "passport";
import passportConfig from "./util/auth.js";
import {cdate} from "cdate"


import indexRouter from "./routes/index.js";
import usersRouter from "./routes/users.js";
import bookRouter from "./routes/book.js";
// import adminRouter from "./routes/admin.js";
// import rentalRouter from "./routes/rental.js";

import cors from "cors"

const app = express();

BigInt.prototype.toJSON = function () {
    return this.toString()
}



app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(import.meta.dirname, "public")));

// session
app.use(session({
  secret: "??IU^z89tg1wjH%(6oRd>l@%",
  resave: false,
  saveUninitialized: false,
  cookie: {maxAge: 60 * 60 * 1000}
}));
// passport
app.use(passport.authenticate("session"));
passportConfig(passport);

//cors
app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    }),
);

// cdate を使えるようにする
app.use((req, res, next) => {
  res.locals.date_format =
      (d) => cdate(d).format("YYYY-MM-DD HH:mm:ss");
  next();
});


app.use("/", indexRouter);
app.use("/user", usersRouter);
app.use("/book", bookRouter);
// app.use("/admin", adminRouter);
// app.use("/rental", rentalRouter);


/**
 * error handler
 * 様々な場所でエラーが発生、または発生させて
 * こちらでまとめて対処するための関数。
 *
 * @type express.ErrorRequestHandler
 */
// const errorHandler = (err, req, res, next) => {
//   // デフォルトは内部サーバーエラーとしておく。
//   let message = "Internal Server Error";
//   if (err.status === 401) {
//     // ここに来る場合は、未認証によるエラーなのでメッセージを書き換える。
//     message = "NGkkk";
//   } else {
//     // エラーの詳細はクライアントに返さないので、ここで吐き出しておく。
//     console.error(err);
//   }
//   res.status(err.status || 500).json({result:message});
// };
// app.use(errorHandler);

// 404
app.use((req, res, next) => {
  res.status(404).json({message: "not found."});
});




export default app;