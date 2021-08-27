import { Router } from "express";
import { SampleEndpoint } from "@endpoints";
export const router = Router();

// place your base endpoints here
router.use("/sample", SampleEndpoint);
