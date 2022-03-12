import express from "express";
import mongoose from "mongoose";
import MongoStore from "connect-mongo";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import path from "path";
import session from "express-session";
import Agenda from "agenda";
import { TwitterApi } from "twitter-api-v2";
import Rollbar from "rollbar";

const theblockchainapi = require("theblockchainapi");

import { authModule, nftModule, profileModule, tweetModule } from "./modules";
import { authenticate } from "./middlewares";
import Mailer from "./mailer";
import { fetchAllNftInCollection } from "./helpers/magicedenHelpers";
import { coinModule } from "./modules/Coin";
import { daoModule } from "./modules/DAO";

class Server {
  constructor({ port }) {
    this.express = express();
    this.express.set("port", port);
    this.start();
    return this.express;
  }

  async start() {
    this.connectDatabase();
    this.initSessions();
    this.initCache();
    this.initMiddleware();
    this.forceSecure();
    this.publicRoot = path.join("public");
    this.express.use(express.static(this.publicRoot));
    this.initPublicRoutes();
    this.initPrivateRoutes();
    this.express.use("/*", (req, res) => {
      res.sendFile("index.html", { root: this.publicRoot });
    });
    this.initErrorHandler();
    this.initErrorRoute();
    this.initApis();
    this.startNftQueue();
    this.initAwsServices();
    // await this.initMailer(); <== we will unable later
  }
  async connectDatabase() {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      autoIndex: true,
    });
    const db = mongoose.connection;
    db.on("error", console.error.bind(console, "connection error:"));
    db.once("open", () => {
      console.log("DB has been connected");
    });
  }
  initSessions() {
    this.express.use(
      session({
        saveUninitialized: false,
        resave: true,
        name: "solaritySession",
        secret: process.env.SESSION_SECRET,
        store: MongoStore.create({
          mongoUrl: process.env.MONGO_URL,
        }),
      })
    );
  }
  async initMailer() {
    // for later user
    const mailer = new Mailer();
    await mailer.init();
    global.mailer = this.express.set("mailer", mailer);
  }
  initPublicRoutes() {
    // put here the public routes
    console.log("> Starting public routes");
    if (process.env.NODE_ENV !== "production") {
      // only for testing
      this.express.get("/api/test", (req, res) => {
        res.sendFile(path.join(__dirname, "index.html"));
      });
    }
    this.express.use("/api/auth", authModule);
  }
  initPrivateRoutes() {
    // put here the private routes
    console.log("> Starting private routes");
    this.express.use("/api", authenticate);
    this.express.use("/api/profile", profileModule);
    this.express.use("/api/nft", nftModule);
    this.express.use("/api/tweets", tweetModule);
    this.express.use("/api/coins", coinModule);
    this.express.use("/api/dao", daoModule);

    this.express.use("/api/*", (req, res, next) => {
      const err = new Error("Not Found");
      err.status = 404;
      next(err);
    });
  }
  initMiddleware() {
    // middleware initialization
    const scriptSources = ["'self'", "'unsafe-inline'", "'unsafe-eval'"];
    this.express.use(
      helmet.contentSecurityPolicy({
        useDefaults: false,
        directives: {
          "default-src": scriptSources,
          "script-src": scriptSources,
          "script-src-elem": [...scriptSources, "https://code.jquery.com"],
          "style-src": null,
        },
      })
    );
    this.express.use(
      helmet({
        contentSecurityPolicy: false,
      })
    );
    this.express.use(express.json());
    this.express.use(express.urlencoded({ extended: false }));
    this.express.use(cookieParser());
  }
  forceSecure() {
    // force to https on production
    this.express.enable("trust proxy");
    this.express.use((req, res, next) => {
      if (process.env.NODE_ENV == "production" && !req.secure) {
        return res.redirect("https://" + req.headers.host + req.url);
      }
      next();
    });
  }
  initCache() {
    // initialize nodecache here if needed
  }
  initErrorRoute() {
    this.express.use((req, res, next) => {
      const err = new Error("Not Found");
      err.status = 404;
      next(err);
    });
    this.express.use((err, req, res, next) => {
      res.status(err.status || 500);
      res.locals.error = err;
      res.locals.errorDescription = err.message;
      console.log(err);
      return res.send("ERROR: NOT FOUND");
    });
  }
  initErrorHandler() {
    this.express.use(async (err, req, res, next) => {
      return next(err);
    });
  }
  initApis() {
    // theblockchainapi init
    let defaultClient = theblockchainapi.ApiClient.instance;
    let APIKeyID = defaultClient.authentications["APIKeyID"];
    APIKeyID.apiKey = process.env.BLOCKCHAINAPI_KEY_ID;
    var APISecretKey = defaultClient.authentications["APISecretKey"];
    APISecretKey.apiKey = process.env.BLOCKCHAINAPI_SECRET_KEY;
    this.express.set("theblockchainapi", theblockchainapi);
    // twitter api init
    const twitterClient = new TwitterApi(process.env.TWITTER_BEARER_TOKEN);
    const twitterApi = twitterClient.readOnly;
    this.express.set("twitterApi", twitterApi);
    // rollbar api
    let rollbar = new Rollbar({
      accessToken: process.env.ROLLBAR_ACCESSTOKEN,
      captureUncaught: true,
      captureUnhandledRejections: true,
    });
    this.express.set("rollbar", rollbar);
    global.rollbar = rollbar;
  }
  startNftQueue() {
    const nftQueue = new Agenda({
      db: {
        address: process.env.MONGO_URL,
        collection: "nftJobs",
      },
    });
    nftQueue.maxConcurrency(1);
    nftQueue.define("fetchCollection", async ({ attrs: { data } }) => {
      await fetchAllNftInCollection(data);
    });
    nftQueue.start();
    this.express.set("nftQueue", nftQueue);
  }
}

export default Server;
