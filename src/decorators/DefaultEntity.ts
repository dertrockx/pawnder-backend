import {
	BaseEntity,
	BeforeInsert,
	BeforeUpdate,
	Column,
	DeleteDateColumn,
	PrimaryGeneratedColumn,
	ValueTransformer,
} from "typeorm";

const deleteDateTransformer: ValueTransformer = {
	to: (date) => date,
	from: (value) => !value,
};

export class DefaultEntity extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@DeleteDateColumn({ select: false, transformer: deleteDateTransformer })
	deleted: boolean;

	@Column({
		select: false,
		type: "timestamp",
		default: () => "CURRENT_TIMESTAMP",
	})
	createdAt: Date;

	@Column({
		select: false,
		type: "timestamp",
		default: () => "CURRENT_TIMESTAMP",
	})
	updatedAt: Date;

	@BeforeInsert()
	updateDateCreation() {
		this.createdAt = new Date();
	}

	@BeforeUpdate()
	updateDateUpdate() {
		this.updatedAt = new Date();
	}
}
