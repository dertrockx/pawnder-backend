import { Router, Request, Response } from "express";
import { SampleHandler } from "../handlers";

export const SampleEndpoint = Router();

const getItems = (req: Request, res: Response) => {
	const handler = new SampleHandler();
	const items = handler.getSamples();

	return res.json({ items });
};

SampleEndpoint.get("/", getItems);
