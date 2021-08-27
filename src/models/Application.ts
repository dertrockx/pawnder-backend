import { DefaultEntity } from "@decorators";
import { Entity, Column } from "typeorm";
import { User, Pet } from "@models";
import { ApplicationStatusEnum } from "@constants";

@Entity()
export class Application extends DefaultEntity {
	@Column("int")
	userId: number;

	@Column("int")
	petId: number;

	@Column({
		type: "enum",
		enum: ApplicationStatusEnum,
		default: ApplicationStatusEnum.Pending,
	})
	status: ApplicationStatusEnum;
}
