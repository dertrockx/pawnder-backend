import { Response, Request, Router } from "express";
import { StoryHandler } from "@handlers";
import multer from "multer";

import { imageFilter, files } from "@utils";
import { errors } from "@constants";

const storage = multer.diskStorage({
	filename: (req, file, cb) => {
		cb(null, `${Date.now()} - ${file.originalname}`);
	},
});

const upload = multer({ storage, fileFilter: imageFilter });

export const StoryEndpoint = Router();

interface ListQuery {
	institutionId?: string;
	published?: string;
}

interface StoryBody {
	institutionId?: string;
	title?: string;
	body?: string;
	tags?: string;
	isDraft?: string;
}

const getStories = async (
	req: Request<any, any, any, ListQuery>,
	res: Response
) => {
	let { institutionId, published = undefined } = req.query;
	const options = {};
	if (published) {
		const parsed = parseInt(published);
		if (isNaN(parsed))
			return res.status(400).json({
				msg: "`published` field in url parameters should be a whole number",
			});
		if (parsed < 0 || parsed > 1)
			return res.status(400).json({
				msg: "`published` field in url parameters only accepts 1 or 0 as value",
			});
		Object.assign(options, { published: parsed });
	}

	if (institutionId) Object.assign(options, { institutionId });

	const handler = new StoryHandler();
	try {
		const stories = await handler.getStories(options);
		return res.json({ stories });
	} catch (err) {
		console.log(err);
		return res.status(500).json({ msg: "Server error. Please contact admin" });
	}
};

const getStory = async (req: Request, res: Response) => {
	const { id } = req.params;
	const handler = new StoryHandler();
	try {
		const story = await handler.getStory(parseInt(id));

		return res.json({ story });
	} catch (err) {
		console.log(err);
		if (err.message === errors.NOT_FOUND)
			return res.status(404).json({ msg: "Story not found" });
	}
};

const createStory = async (
	req: Request<any, any, StoryBody, any>,
	res: Response
) => {
	console.log(req.file);
	// isDraft field is sent as a `string` when sent via multipart/form-data
	const { title, body, tags, institutionId, isDraft = "true" } = req.body;

	if (!title || !body || !tags || !institutionId)
		return res.status(400).json({
			msg: "title, body, tags, and institutionId fields are required in body",
		});
	const handler = new StoryHandler();
	try {
		let story = await handler.create(parseInt(institutionId), {
			title,
			body,
			// isDraft field is sent as a `string` when sent via multipart/form-data
			isDraft: isDraft === "true",
		});
		const result = await files.uploader.upload(req.file.path, {
			folder: `/institution/${institutionId}/stories/${story.id}`,
			public_id: "headlinePhoto",
		});
		story = await handler.setHeadlineUrl(story.id, result.secure_url);
		return res.status(201).json({ story });
	} catch (err) {
		console.log(err);
		res.status(500).json({ msg: "Server error. Please contact admin" });
	}
};

const updateStory = async (
	req: Request<any, any, StoryBody, { publish: string }>,
	res: Response
) => {
	let { isDraft, ...body } = req.body;
	const { id } = req.params;

	const { publish } = req.query;
	const { file } = req;
	const handler = new StoryHandler();

	// any non-zero number publishes this story
	if (publish && !isNaN(parseInt(publish)))
		Object.assign(body, { isDraft: parseInt(publish) === 0 });

	try {
		let story = await handler.update(id, body);
		if (file) {
			const result = await files.uploader.upload(file.path, {
				folder: `/institution/${story.institutionId}/stories/${story.id}`,
				public_id: "headlinePhoto",
			});
			story = await handler.setHeadlineUrl(story.id, result.secure_url);
		}
		return res.json({ story });
	} catch (err) {
		console.log(err);
		if (err.message === errors.NOT_FOUND)
			return res.status(404).json({ msg: "Story not found" });
		return res.status(500).json({ msg: "Server error. Please contact admin" });
	}
};

const deleteStory = async (req: Request, res: Response) => {
	const { id } = req.params;
	const handler = new StoryHandler();
	try {
		await handler.delete(parseInt(id));
		return res.json({
			msg: `Successfully deleted story with ID ${id}`,
		});
	} catch (err) {
		console.log(err);
		if (err.message === errors.NOT_FOUND)
			return res.status(404).json({ msg: "Story not found" });

		return res.status(500).json({ msg: "Server error. Please contact admin." });
	}
};

StoryEndpoint.get("/", getStories);
StoryEndpoint.get("/:id", getStory);
// the second argument is a middleware
StoryEndpoint.post("/", upload.single("headlinePhoto"), createStory);
StoryEndpoint.put("/:id", upload.single("headlinePhoto"), updateStory);
StoryEndpoint.delete("/:id", deleteStory);
