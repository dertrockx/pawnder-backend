import { getRepository } from "typeorm";
import { Story } from "@models";
import { errors } from "@constants";
interface StoryBody {
	title?: string;
	body?: string;
	isDraft?: boolean;
}

export class StoryHandler {
	async getStories(institutionId?: number | string): Promise<Story[]> {
		const query = getRepository(Story).createQueryBuilder("story");
		if (institutionId) {
			query.where("story.institutionId = :institutionId", { institutionId });
		}
		const story = await query.getMany();
		return story;
	}

	async getStory(id: number): Promise<Story> {
		const story = await Story.findOne(id);
		if (!story) throw new Error(errors.NOT_FOUND);
		return story;
	}

	async create(institutionId: number, options: StoryBody): Promise<Story> {
		const story = new Story();
		Object.assign(story, {
			isDraft: true,
			headlineUrl: "",
			institutionId,
			...options,
		});
		await story.save();
		return story;
	}

	async setHeadlineUrl(id: number, url: string): Promise<Story> {
		const story = await Story.findOne(id);
		Object.assign(story, { headlineUrl: url });

		await story.save();
		return story;
	}

	async update(id: number, options: StoryBody): Promise<Story> {
		const story = await Story.findOne(id);
		if (!story) throw new Error(errors.NOT_FOUND);
		Object.assign(story, { ...options });
		await story.save();
		return story;
	}

	async delete(id: number): Promise<boolean> {
		const story = await Story.findOne(id);
		if (!story) throw new Error(errors.NOT_FOUND);
		await story.softRemove();
		return true;
	}
}
