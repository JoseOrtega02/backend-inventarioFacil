import express, { NextFunction,Request,RequestHandler,Response } from "express";
import "dotenv/config"
import mongoose from "mongoose";
import session from "express-session";
import MongoStore from "connect-mongo"
import createHttpError, { isHttpError } from "http-errors";
import userRoutes from "./Routes/userRoutes.js"
import tableRoutes from "./Routes/tableRoutes.js"
import salesRoutes from "./Routes/salesRoutes.js";
import { limiter } from "./middleware/rateLimiter.js";
import cors from "cors"
import helmet from "helmet";
import { doubleCsrf } from "csrf-csrf";
import cookieParser  from "cookie-parser"
import morgan from "morgan"
const app = express();
const PORT = process.env.PORT;
const corsOptions={
  origin: 'http://example.com', 
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
}
app.use(morgan("dev"))
app.use(cors(corsOptions))
app.use(helmet())
app.use(express.json())
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET || "",
  resave: false,
  saveUninitialized: false,
  cookie: {
      maxAge: 60 * 60 * 1000,
  },
  rolling: true,
  store: MongoStore.create({
      mongoUrl: process.env.MONGO_STRING_CONECTION
  }),
}));
const {
  doubleCsrfProtection,
  generateToken
} = doubleCsrf({
  getSecret: () => "Secret", // A function that optionally takes the request and returns a secret
  cookieName: "__Host-psifi.x-csrf-token", // The name of the cookie to be used, recommend using Host prefix.
  cookieOptions: {
    sameSite: "lax",
    path: "/",
    secure: true
  },
  size: 64, // The size of the generated tokens in bits
  ignoredMethods: ["GET", "HEAD", "OPTIONS"], // A list of request methods that will not be protected.
  getTokenFromRequest: (req) => req.headers["x-csrf-token"], // A function that returns the token from the request
});
const myRoute:RequestHandler = (req, res) => {
  const csrfToken = generateToken(req, res);
  // You could also pass the token into the context of a HTML response.
  res.json({ csrfToken });
};
app.get("/csrf-token", myRoute)
app.use(doubleCsrfProtection);
app.use(limiter)
app.use("/user",userRoutes)
app.use("/table",tableRoutes)
app.use("/sale",salesRoutes)

app.use((req, res, next) => {
  next(createHttpError(404, "Endpoint not found"));
});


app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
  console.error(error);
  let errorMessage = "An unknown error occurred";
  let statusCode = 500;
  if (isHttpError(error)) {
      statusCode = error.status;
      errorMessage = error.message;
  }
  res.status(statusCode).json({ error: errorMessage });
});

const uri:string = process.env.MONGO_STRING_CONECTION || ""

mongoose.connect(uri)
  .then(() => {
    console.log("MongoDB conected")
    app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
  }).catch((err) => {
    console.log(err)
  });

