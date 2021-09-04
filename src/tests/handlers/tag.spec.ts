import { TagHandler } from "@handlers";
import { Tag } from "@models";
import { EntityManager, getManager, getRepository } from "typeorm";
import { errors } from "@constants";

describe("TagHandler", () => {
	let manager: EntityManager;
	const handler = new TagHandler();

	beforeAll(async () => {
		manager = getManager();

		const query = `
      INSERT INTO tag (storyId, text) VALUES (1, 'tag1'), (1, 'tag2')
    `;

		await manager.query(query);
	});

	describe("Get all tags from storyId = 1", () => {
		let tags: Tag[];

		beforeAll(async () => {
			tags = await handler.getTagsbyStoryId(1);
		});

		it("should return all tags", () => {
			expect(tags).toHaveLength(2);
		});
	});

	describe("Create a new tag", () => {
		let tag: Tag;
		beforeAll(async () => {
			tag = await handler.createTag(1, {
				text: "I am a tag",
			});
		});

		it("should create a new tag with text `I am a tag`", () => {
			expect(tag.text).toBe("I am a tag");
		});
	});

	describe("Create multiple tags for story id = 1", () => {
		let tags: Tag[] = [];

		beforeAll(async () => {
			// TODO: use method `createTags` in handler to create multiple tags at the same time
			const tagsText = ["tag1", "tag2", "tag3", "tag4", "tag5"];

			// NOTE: this is just an example solution for this test
			// para sa may guide ka sa pag - create mo ng method Soph.  Good luck :)

			// const tagRepository = getRepository(Tag);

			// tags = tagsText.map((text) => {
			// 	const newTag = new Tag();
			// 	Object.assign(newTag, { storyId: 1, text });
			// 	return newTag;
			// });

			// tags = await tagRepository.save(tags);

			tags = await handler.createTags(1, tagsText);
		});
		it("should return all tags created", () => {
			tags.forEach((tag) => expect(tag).toBeTruthy());
		});
	});

	describe("Update tag `I am a tag` to `I am a tag but updated`", () => {
		let tag: Tag;

		beforeAll(async () => {
			const t = await Tag.findOne({ text: "I am a tag" });
			tag = await handler.updateTag(t.id, {
				text: "I am a tag but updated",
			});
		});

		it("should update tag", () => {
			expect(tag.text).toBe("I am a tag but updated");
		});
	});

	describe("Delete a tag with text `I am a tag but updated`", () => {
		let tag: Tag;
		beforeAll(async () => {
			tag = await Tag.findOne({ text: "I am a tag but updated" });
			await handler.deleteTag(tag.id);
		});

		it("should not be returned when queried", () => {
			expect(handler.getTag(tag.id)).rejects.toThrow(errors.NOT_FOUND);
		});
	});

	afterAll(async () => {
		await manager.query("DELETE FROM tag");
		await manager.query("ALTER TABLE tag AUTO_INCREMENT = 1");
	});
});
