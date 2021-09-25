import { Router } from "express";
import {
	SampleEndpoint,
	InstitutionEndpoint,
	StoryEndpoint,
	PetEndpoint,
	PhotoEndpoint,
	ApplicationEndpoint,
	AuthEndpoint,
	UserEndpoint,
	IgnoredEndpoint,
} from "@endpoints";
export const router = Router();

// place your base endpoints here
router.use("/sample", SampleEndpoint);
router.use("/institution", InstitutionEndpoint);
router.use("/story", StoryEndpoint);
router.use("/user", UserEndpoint);
router.use("/pet", PetEndpoint);
router.use("/photo", PhotoEndpoint);
router.use("/application", ApplicationEndpoint);
router.use("/auth", AuthEndpoint);
router.use("/ignore", IgnoredEndpoint);
