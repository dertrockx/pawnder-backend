import { Router } from "express";
import {
	SampleEndpoint,
	InstitutionEndpoint,
	StoryEndpoint,
	PetEndpoint,
	PhotoEndpoint,
} from "@endpoints";
export const router = Router();

// place your base endpoints here
router.use("/sample", SampleEndpoint);
router.use("/institution", InstitutionEndpoint);
router.use("/story", StoryEndpoint);
router.use("/pet", PetEndpoint);
router.use("/photo", PhotoEndpoint);
