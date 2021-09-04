import { Story, Tag } from '@models';
import { errors } from '@constants';

interface TagBody {
    storyId?: number;
    story?: Story;
    text?: string;
}

export class TagHandler {
    async getTagsbyStoryId(storyId: number): Promise<Tag[]> {
        const tag = await Tag.find({ storyId });
        return tag;
    }

    async getTag(id: number | string): Promise<Tag> {
        const tag = await Tag.findOne(id); 
        if (!tag) throw new Error (errors.NOT_FOUND); 
        return tag;
    }

    async createTag(storyId: number, options: TagBody): Promise<Tag> {
        const tag = new Tag(); 
        Object.assign(tag, {
            storyId,
            ...options,
        });
        await tag.save(); 

        return tag;
    }

    async createTags(storyId: number, texts: any): Promise<Tag[]> {
        const tags = texts.map((text) => {
            const newTag = new Tag();
            Object.assign(newTag, { storyId, text });
            return newTag;
        });

        await Tag.save(tags);
        console.log(tags);
        return tags;
    }

    async updateTag(id: number | string, options: TagBody): Promise<Tag> {
        const tag = await Tag.findOne(id); 
        if (!tag) throw new Error(errors.NOT_FOUND);

        Object.assign(tag, {...options});
        await tag.save();

        return tag;
    }

    async deleteTag(id: number | string): Promise<boolean> {
        const tag = await Tag.findOne(id); 
        if (!tag) throw new Error(errors.NOT_FOUND); 

        await tag.softRemove();

        return true;
    }
}