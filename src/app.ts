import express, { json, Application } from "express";
import cors from "cors";

import { Routers } from "./routers";

export class App {
  public app: Application;
  protected router: Routers;

  constructor() {
    this.app = express();
    this.router = new Routers();
    this.setConfig();
    this.routes();
  }

  setConfig() {
    this.app.use(json());
    this.app.use(cors());
  }
  routes() {
    const app = this.app;
    const { router } = this.router;
    app.use(router);
  }
}
