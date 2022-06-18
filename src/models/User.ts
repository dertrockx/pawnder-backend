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

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  middleName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ type: "timestamp", nullable: true })
  birthDate: Date;

  @Column({
    type: "enum",
    enum: SexEnum,
    default: SexEnum.Male,
    nullable: true,
  })
  sex: SexEnum;

  @Column({ nullable: true })
  photoUrl: string;

  @Column({ nullable: true })
  contactNumber: string;

  @Column({ type: "float", nullable: true })
  locationLat: number;

  @Column({ type: "float", nullable: true })
  locationLong: number;

  // User preferences
  @Column({
    type: "enum",
    enum: AnimalTypeEnum,
    default: AnimalTypeEnum.Dogs,
    nullable: true,
  })
  preferredAnimal: AnimalTypeEnum;

  @Column({
    type: "enum",
    enum: ActionEnum,
    default: ActionEnum.Adopt,
    nullable: true,
  })
  action: ActionEnum;

  @Column({ type: "float", nullable: true })
  preferredDistance: number;

  @OneToMany(() => UserIgnoredPet, (ignoredPet) => ignoredPet.user)
  ignoredPets: UserIgnoredPet[];
}
