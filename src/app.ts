import express, { json, Application } from "express";
import "express-async-errors";
import cors from "cors";

import { Routers } from "./routers";
import { errorHandlerMiddleware } from "./middlewares/errorHandlerMiddleware";

export class App {
  public app: Application;
  protected router: Routers;

  constructor() {
    this.app = express();
    this.router = new Routers();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.app.use(json());
    this.app.use(cors());
  }
  routes() {
    const { router } = this.router;

    this.app.use(router);
    this.app.use(errorHandlerMiddleware);
  }
}
