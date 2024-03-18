import express, {
  Express,
  Request,
  Response,
  NextFunction,
  Application,
} from "express";
import { json } from "body-parser";
import * as http from "http";
import cookieSession from "cookie-session";
//import cookieParser from "cookie-parser";
import cors from "cors";
import SocketIOController from "./io";
import { signinRouter } from "./modules/auth/routes/signin";
import { signupRouter } from "./modules/auth/routes/signup";
import DB from "./db";
import { GraphqlInitialization } from "./graphql";
import { currentUserRouter } from "./modules/auth/routes/current-user";
import { errorHandler } from "./modules/auth/middlewares/error-handler";
import cookieParser from "cookie-parser";

const app: any = express();

// SERVER SETUP

app.use(json());
app.set("trust proxy", 1); // trust first proxy

// THIS FOR STORING SESSIONS AND COOKIES AT THE CLIENT AND GET THEM BACK
app.use(
  cookieSession({
    signed: false,
    //secure: process.env.NODE_ENV !== "test",
    httpOnly: false,
  })
);

// THIS FROM READING COOKIES FROM HEADERS AND STORE THEM IN REQ.COOKIES
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["POST", "GET", "PUT", "PATCH", "DELETE"],
  })
);

// app.use((req: any, res: any, next: any) => {
//   console.log(req.headers.cookie);
//   console.log(req.cookies);
//   next();
// });

// ROUTES

app.use(signinRouter);
app.use(currentUserRouter);
app.use(signupRouter);

(async () => {
  try {
    // SERVER INITIALIZATION

    const server = http.createServer(app);

    // graphql

    await GraphqlInitialization(app, server);

    // Modified server startup

    await new Promise<void>((resolve) =>
      server.listen({ port: 4000 }, resolve)
    );

    console.log(`🚀 Server ready at http://localhost:4000/`);
    //DB AND SOCKET CONNECTION

    SocketIOController.instance().initialize(server);
    SocketIOController.instance().start();

    DB.instance().initialize();
  } catch (err) {
    SocketIOController.instance().closeServer();
    DB.instance().closeConnection();
  }

  process.on("SIGINT", async () => {
    await DB.instance().closeConnection();
    process.exit(0);
  });

  // ERROR HANDLING , SHOULD BE CALLED AFTER INITIZLIZING GRAPHQL SERVER
  app.use(errorHandler);
})();
