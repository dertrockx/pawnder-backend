import { DefaultEntity } from "@decorators";
import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { Institution } from "@models";
@Entity()
export class SocialMediaLink extends DefaultEntity {
	@Column("int")
	institutionId: number;

	@ManyToOne(() => Institution, (institution) => institution.links)
	@JoinColumn({ name: "institutionId" })
	institution: Institution;

	@Column()
	url: string;

	@Column()
	type: string;
}
