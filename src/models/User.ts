import { DefaultEntity } from "@decorators";
import { AnimalTypeEnum, ActionEnum, SexEnum } from "@constants";
import { Entity, Column, OneToMany } from "typeorm";
import { UserIgnoredPet } from "./UserIgnoredPet";
import { transformHashedValue } from "@utils";
@Entity()
export class User extends DefaultEntity {
	@Column()
	email: string;

	@Column({ select: false, transformer: transformHashedValue })
	password: string;

	@Column()
	firstName: string;

	@Column()
	middleName: string;

	@Column()
	lastName: string;

	@Column("timestamp")
	birthDate: Date;

	@Column({
		type: "enum",
		enum: SexEnum,
		default: SexEnum.Male,
	})
	sex: SexEnum;

	@Column()
	photoUrl: string;

	@Column()
	contactNumber: string;

	@Column("float")
	locationLat: number;

	@Column("float")
	locationLong: number;

	// User preferences
	@Column({
		type: "enum",
		enum: AnimalTypeEnum,
		default: AnimalTypeEnum.Dogs,
	})
	preferredAnimal: AnimalTypeEnum;

	@Column({
		type: "enum",
		enum: ActionEnum,
		default: ActionEnum.Adopt,
	})
	action: ActionEnum;

	@Column("float")
	preferredDistance: number;

	@OneToMany(() => UserIgnoredPet, (ignoredPet) => ignoredPet.user)
	ignoredPets: UserIgnoredPet[];
}
