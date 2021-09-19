import { DefaultEntity } from "@decorators";
import { Institution } from "./Institution";
import { UserIgnoredPet } from "./UserIgnoredPet";
import { Entity, JoinColumn, ManyToOne, Column, OneToMany } from "typeorm";
import { SexEnum, ActionEnum, AnimalTypeEnum } from "@constants";
import { Photo } from "./Photo";

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

	@OneToMany(() => Photo, (photo) => photo.pet)
	photos: Photo[];

	@OneToMany(() => UserIgnoredPet, (ignore) => ignore.pet)
	ignorees: UserIgnoredPet[];
}
