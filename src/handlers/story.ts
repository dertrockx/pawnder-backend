import { getRepository, getManager } from "typeorm";
import { Institution, Story, Tag } from "@models";
import { errors } from "@constants";
interface StoryBody {
	title?: string;
	body?: string;
	isDraft?: boolean;
}

export class StoryHandler {
	async getStories(options?: {
		institutionId?: number | string;
		published?: number;
	}): Promise<Story[]> {
		// since I will be using a raw-query, "isDraft" returns 1 or 0 instead of a boolean type
		// in accordance with MySQL's default ways
		const query = getManager()
			.createQueryBuilder(Story, "s")
			.select("s.id", "id")
			.addSelect("s.institutionId", "institutionId")
			.addSelect("s.isDraft", "isDraft")
			.addSelect("s.publishedAt", "publishedAt")
			.addSelect("s.title", "title")
			.addSelect("s.body", "body")
			.addSelect("s.headlineUrl", "headlineUrl")
			.addSelect("insti.name", "institutionName")
			.addSelect("group_concat(t.text SEPARATOR ', ')", "tags")
			.leftJoin(Institution, "insti", "s.institutionId = insti.id")
			.leftJoin(Tag, "t", "s.id = t.storyId")
			.groupBy("id");

		let stories: Story[] = [];
		const { published, institutionId } = options;

		if (!published && !institutionId) {
			stories = await query.getRawMany();

			return stories;
		}

		if (institutionId) {
			query.where("s.institutionId = :institutionId", { institutionId });
		}
		if (published === 0 || published === 1) {
			console.log(published);
			query.andWhere("s.isDraft = :isDraft", { isDraft: !published });
		}

		stories = await query.getRawMany();

		return stories;
	}

	async getStory(id: number): Promise<Story> {
		const story = await Story.findOne(id);
		if (!story) throw new Error(errors.NOT_FOUND);
		return story;
	}

	async create(institutionId: number, options: StoryBody): Promise<Story> {
		const manager = getManager();
		const story = await manager.create(Story, {
			headlineUrl: "",
			institutionId,
			...options,
		});
		await manager.save(story);
		// const story = await manager.create<Story>({
		// 	headlineUrl: "",
		// 	institutionId,
		// 	...options
		// })
		// const story = new Story();
		// Object.assign(story, {
		// 	headlineUrl: "",
		// 	institutionId,

		// 	...options,
		// });
		// await story.save();

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
