import { DefaultEntity } from "@decorators";
import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { Pet } from "./Pet";

@Entity()
export class Photo extends DefaultEntity {
	@Column("int")
	petId: number;

	@Column()
	url: string;

	@ManyToOne(() => Pet, (pet) => pet.photos)
	@JoinColumn({ name: "petId" })
	pet: Pet;
}
