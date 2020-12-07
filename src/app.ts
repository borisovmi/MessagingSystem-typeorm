import bodyParser from "body-parser";
import express from "express";
import "reflect-metadata";
import { createConnection } from "typeorm";
import { error404Controller, errorController } from "./controllers/error.ctrl";
import { isAuth } from "./middlewares/auth.mw";
import { cors } from "./middlewares/cors.mw";
import { UserJwtPayload } from "./models/User";
import authRoutes from "./routes/auth.routes";
import messageRoutes from "./routes/message.routes";
import messagesRoutes from "./routes/messages.routes";
import helmet from "helmet";

declare global {
  namespace Express {
    interface Request {
      user?: UserJwtPayload;
    }
  }
}

const app = express();

app.use(bodyParser.json());

app.use(cors);
app.use(helmet());

app.get("/health", (req, res, next) => {
  res.send("OK");
});

app.use("/auth", authRoutes);
app.use(isAuth);
app.use("/message", messageRoutes);
app.use("/messages", messagesRoutes);

app.use(error404Controller);

app.use(errorController);

createConnection()
  .then((connection) => {
    app.listen(3000, () => console.log("Server runs on http://localhost:3000"));
  })
  .catch((error) => {
    console.log(error);
  });
