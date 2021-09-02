import { Institution, SocialMediaLink } from "@models";
import { errors } from "@constants";

interface LinkBody {
  institutionId?: number;
  institution?: Institution;
  url?: string;
  type?: string;
}

export class SocialMediaLinkHandler {
  async getLinks(institutionId: number): Promise<SocialMediaLink[]> {
    const link = await SocialMediaLink.find({ institutionId });
    return link;
  }

  async create(institutionId: number, options: LinkBody): Promise<SocialMediaLink> {
    const link = new SocialMediaLink();
    Object.assign(link, {
      institutionId,
      ...options,
    });
    await link.save();
    return link;
  }

  async update(id: number, options: LinkBody): Promise<SocialMediaLink> {
    const link = await SocialMediaLink.findOne(id);
    if (!link) throw new Error(errors.NOT_FOUND);
    Object.assign(link, { ...options });
    await link.save();
    return link;
  }

  async delete(id: number): Promise<boolean> {
    const link = await SocialMediaLink.findOne(id);
    if (!link) throw new Error(errors.NOT_FOUND);
    await link.softRemove();
    return true;
  }
}
