import { DefaultEntity } from "@decorators";
import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { User, Pet } from "@models";

@Entity()
export class UserIgnoredPet extends DefaultEntity {
	@Column("int")
	userId: number;

	@ManyToOne(() => User, (user) => user.ignoredPets)
	@JoinColumn({ name: "userId" })
	user: User;

	@Column("int")
	petId: number;

	@ManyToOne(() => Pet, (pet) => pet.ignorees)
	@JoinColumn({ name: "petId" })
	pet: Pet;
}
