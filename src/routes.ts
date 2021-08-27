import { Router } from "express";
import { SampleEndpoint, InstitutionEndpoint } from "@endpoints";
export const router = Router();

// place your base endpoints here
router.use("/sample", SampleEndpoint);
router.use("/institution", InstitutionEndpoint);
