import { Story } from "@models";

interface StoryBody {
	title?: string;
	body?: string;
	isDraft?: boolean;
}

export class StoryHandler {
	async getStories(institutionId: number): Promise<Story[]> {
		const story = await Story.find({ institutionId });
		return story;
	}

	async getStory(id: number): Promise<Story> {
		const story = await Story.findOne(id);
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
		Object.assign(story, { ...options });
		await story.save();
		return story;
	}

	async delete(id: number): Promise<boolean> {
		const story = await Story.findOne(id);
		await story.softRemove();
		return true;
	}
}
