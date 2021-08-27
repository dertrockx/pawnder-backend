import { DefaultEntity } from "@decorators";
import { Column, Entity, JoinTable, ManyToOne, OneToMany } from "typeorm";
import { Institution } from "./Institution";
import { Tag } from "./Tag";

@Entity()
export class Story extends DefaultEntity {
	@Column("int")
	institutionId: number;

	@ManyToOne(() => Institution, (institution) => institution.stories)
	@JoinTable({ name: "institutionId" })
	institution: Institution;

	@Column("bool")
	isDraft: boolean;

	@Column()
	title: string;

	@Column("longtext")
	body: string;

	@Column()
	headlineUrl: string;

	@OneToMany(() => Tag, (tag) => tag.story)
	tags: Tag[];
}
