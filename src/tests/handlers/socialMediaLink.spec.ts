import { SocialMediaLinkHandler } from "@handlers";
import { SocialMediaLink } from "@models";
import { EntityManager, getManager, getRepository } from "typeorm";
import { errors } from "@constants";

describe("SocialMediaLinkHandler", () => {
  let manager: EntityManager;
	const handler = new SocialMediaLinkHandler();

  beforeAll(async () => {
    manager = getManager();

    const query = `
    INSERT INTO 
      social_media_link (institutionId, type, url) 
    VALUES 
      (1, 'Website', 'www.petcenter1.org'), 
      (1, 'Facebook', 'www.facebook/petcenter1'),
      (2, 'Website', 'www.petcenter2.org')
    `;
    
    await manager.query(query);

    // const queries = [
    //   `
    //     INSERT INTO 
    //       institution (id, name, locationLat, locationLong, email, contactNumber)
    //     VALUES
    //       (1, 'Pet Center 1', 1.234444, 0.32112, 'petcenter1@email.com', '09090909009'),
    //       (2, 'Pet Center 2', 5.555555, 3.33333, 'petcenter2@email.com', '08080808808')
    //   `,
    //   `
    //     INSERT INTO 
    //       social_media_link (institutionId, type, url)
    //     VALUES
    //       (1, 'Website', 'www.petcenter1.org'),
    //       (2, 'Facebook', 'www.facebook/petcenter1'),
    //       (3, 'Website', 'www.petcenter2.org')
    //   `
    // ]

    // for (const query of queries) {
    //   await manager.query(query);
    // }
    
  });

  fdescribe("Get all links from institutionId = 1", () => {
    let links: SocialMediaLink[];

    beforeAll(async () => {
      links = await handler.getLinks(1);
    });

    fit("should return all social media links in institutionId", () => {
      expect(links).toHaveLength(2);
    });
  });

  fdescribe("Create a new social media link", () => {
    let link; SocialMediaLink;
    beforeAll(async () => {
      link = await handler.create(1, {
        type: "Twitter",
        url: "www.twitter/petcenter1"
      });
    });

    fit("should create a new link with type `Twitter` and url `www.twitter/petcenter1`", () => {
      expect(link.type).toBe("Twitter");
      expect(link.url).toBe("www.twitter/petcenter1");
    });
  });

  fdescribe("Update the url `www.twitter/petcenter1` to `www.twitter/petcenter1-updated`", () => {
    let link: SocialMediaLink;

    beforeAll(async () => {
      const l = await SocialMediaLink.findOne({ url: "www.twitter/petcenter1" });

      link = await handler.update(l.id, {
        url: "www.twitter/petcenter1-updated"
      });
    });

    fit("should update url", () => {
			expect(link.url).toBe("www.twitter/petcenter1-updated");
    });
  });

  fdescribe("Delete a link with url `www.twitter/petcenter1-updated`", () => {
    let link: SocialMediaLink;
    beforeAll(async () => {
      link = await SocialMediaLink.findOne({ url: "www.twitter/petcenter1-updated" });
      await handler.delete(link.id);
    });

    fit("should not be returned when queried", () => {
      expect(handler.getLink(link.id)).rejects.toThrow(errors.NOT_FOUND);
    })
  });

  afterAll(async () => {
    // const tables = ['institution', 'social_media_link'];

    // for (const table of tables) {
    //   await manager.query(`DELETE FROM \`${table}\``);
    //   await manager.query(`ALTER TABLE \`${table}\` AUTO_INCREMENT = 1`);
    // }

		await manager.query("DELETE FROM social_media_link");
		await manager.query("ALTER TABLE tag AUTO_INCREMENT = 1");
	});
});