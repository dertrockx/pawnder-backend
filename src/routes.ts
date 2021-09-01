import { Router } from "express";
import { SampleEndpoint, InstitutionEndpoint, StoryEndpoint } from "@endpoints";
export const router = Router();

// place your base endpoints here
router.use("/sample", SampleEndpoint);
router.use("/institution", InstitutionEndpoint);
router.use("/story", StoryEndpoint);
