import { DefaultEntity } from "@decorators";
import { PhotoOwnerEnum, PetPhotoTypeEnum } from "@constants";
import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { Pet } from "./Pet";

@Entity()
export class Photo extends DefaultEntity {
	@Column("int")
	petId: number;

	@Column({
		default: "",
	})
	url: string;

	@Column({
		type: "enum",
		enum: PhotoOwnerEnum,
		default: PhotoOwnerEnum.Pet,
	})
	owner: PhotoOwnerEnum;

	// 0: main photo
	// 1 - X: other photos

	/*
	There are 2 types of photos for a pet
	1 main and 4 others
	*/
	@Column({
		type: "enum",
		enum: PetPhotoTypeEnum,
		default: PetPhotoTypeEnum.Other,
	})
	type: PetPhotoTypeEnum;

	@ManyToOne(() => Pet, (pet) => pet.photos)
	@JoinColumn({ name: "petId" })
	pet: Pet;
}
