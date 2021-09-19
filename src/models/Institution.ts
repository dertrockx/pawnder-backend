import { DefaultEntity } from "@decorators";
import { Column, Entity, OneToMany } from "typeorm";
import { Pet } from "./Pet";
import { SocialMediaLink } from "./SocialMediaLink";
import { Story } from "./Story";
import { transformHashedValue } from "@utils";
@Entity()
export class Institution extends DefaultEntity {
	@Column()
	name: string;

	@Column({ select: false, transformer: transformHashedValue })
	password: string;

	@Column("float")
	locationLat: number;

	@Column("float")
	locationLong: number;

	@Column()
	email: string;

	@Column()
	contactNumber: string;

	@Column()
	description: string;

	@OneToMany(() => Pet, (pet) => pet.institution)
	pets: Pet[];

	@OneToMany(() => SocialMediaLink, (link) => link.institution)
	links: SocialMediaLink[];

	@OneToMany(() => Story, (story) => story.institution)
	stories: Story[];
}
