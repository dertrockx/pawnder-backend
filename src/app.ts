import express from "express";
import morgan from "morgan";
import { router } from "./routes";

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
