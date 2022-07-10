import { authenticate, validateQuery, validateSchema, uploadImage } from "../middlewares";
import express from "express";

export class RouteModule {
  constructor() {
    this.router = express.Router();
    this.addHelpers();
    this.setup();
    this.defineMiddlewares();
    this.router.use((req, res, next) => {
      this.attach(req, res);
      return next();
    });

    this.publicRoutes();
    this.router.use(authenticate);
    this.privateRoutes();
    return this.router;
  }

  defineMiddlewares() { }

  addHelpers() {
    this.validateSchema = validateSchema;

    this.validateQuery = validateQuery;
    this.uploadImage = uploadImage
  }

  setup() { }

  attach(req, res) { }

  publicRoutes() { }

  privateRoutes() { }
}
