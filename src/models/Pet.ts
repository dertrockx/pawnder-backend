import { DefaultEntity } from "@decorators";
import { Institution } from "./Institution";
import { Entity, JoinColumn, ManyToOne, Column } from "typeorm";
import { SexEnum, ActionEnum, AnimalTypeEnum } from "@constants";

@Entity()
export class Pet extends DefaultEntity {
	@Column("int")
	institutionId: number;

	@Column()
	name: string;

	@Column("float")
	weight: number;

	@Column("float")
	height: number;

	@Column("int")
	age: number;

	@Column()
	breed: string;

	@Column({
		type: "enum",
		enum: AnimalTypeEnum,
		default: AnimalTypeEnum.Dogs,
	})
	animalType: AnimalTypeEnum;

	@Column("longtext")
	medicalHistory: string;

	@Column()
	photoUrl: string;

	@Column({
		type: "enum",
		enum: SexEnum,
		default: SexEnum.Male,
	})
	sex: SexEnum;

	@Column("longtext")
	otherInfo: string;

	@Column({
		type: "enum",
		enum: ActionEnum,
		default: ActionEnum.Adopt,
	})
	action: ActionEnum;

	@ManyToOne(() => Institution, (institution) => institution.pets)
	@JoinColumn({ name: "institutionId" })
	institution: Institution;
}
