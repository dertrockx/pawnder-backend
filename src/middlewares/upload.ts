import multer from "multer";
import { imageFilter } from "@utils";

const storage = multer.diskStorage({
	filename: (req, file, cb) => {
		cb(null, `${Date.now()} - ${file.originalname}`);
	},
});

export const upload = multer({ storage, fileFilter: imageFilter });
