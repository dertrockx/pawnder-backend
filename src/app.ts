import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { router } from "./routes";
import { allowedMethods } from "@middlewares";
export class App {
  public app: express.Express;
  public port: number;

  constructor() {
    this.app = express();
    this.port = this.getPort();

    this.configureServer();
    this.configureRoutes();
  }

  private getPort = (): number => +process.env.PORT || 8081;

  private configureServer = (): void => {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(morgan("dev"));
    this.app.use((req, res, next) => {
      res.setHeader(
        "Access-Control-Allow-Origin",
        process.env.FRONTEND_URL || "http://localhost:3000"
      );
      res.setHeader(
        "Access-Control-Allow-Methods",
        "GET,HEAD,OPTIONS,POST,PUT,DELETE"
      );
      res.setHeader(
        "Access-Control-Allow-Headers",
        "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Authorization"
      );
      res.setHeader("Access-Control-Allow-Credentials", "true");
      next();
    });
    this.app.use(cookieParser());
  };

  private configureRoutes = (): void => {
    this.app.use("/api/0.1", router);
  };

  public start = (): void => {
    console.log("^ Starting application");
    this.app
      .listen(this.port, (): void => {
        console.log(`> Listening on port ${this.port}`);
      })
      .on("error", (err) => console.log(err));
  };
}
