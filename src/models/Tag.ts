import { DefaultEntity } from "@decorators";
import { Column, Entity, JoinTable, ManyToOne, OneToMany } from "typeorm";
import { Story } from "./Story";

@Entity()
export class Tag extends DefaultEntity {
	@Column("int")
	storyId: number;

	@ManyToOne(() => Story, (story) => story.tags)
	story: Story;

	@Column()
	text: string;
}
