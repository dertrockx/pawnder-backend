import { User, Pet, UserIgnoredPet } from "@models";
import { getRepository } from "typeorm";
import { errors, Exception, ModelException } from "@constants";

export interface IgnoredPetBody {
	userId?: string;
	petId?: string;
}

export class IgnoredPetHandler {
	async get(id: string | number): Promise<UserIgnoredPet> {
		const model = await UserIgnoredPet.findOne(id);
		if (!model) throw new Error(errors.NOT_FOUND);
		return model;
	}

	async list(filters: IgnoredPetBody): Promise<UserIgnoredPet[]> {
		const { userId, petId } = filters;
		const query = await getRepository(UserIgnoredPet).createQueryBuilder(
			"ignored"
		);
		if (petId) query.where("ignored.petId = :petId", { petId });
		if (userId) query.andWhere("ignored.userId = :userId", { userId });
		const res = await query.getMany();
		return res;
	}

	async create(options: IgnoredPetBody): Promise<UserIgnoredPet> {
		const { userId, petId } = options;
		const user = await User.findOne(userId);
		if (!user) throw new Error(errors.NOT_FOUND);
		const pet = await Pet.findOne(petId);
		if (!pet) throw new Error(errors.NOT_FOUND);

		const exists = await UserIgnoredPet.findOne({
			userId: parseInt(userId),
			petId: parseInt(petId),
		});
		if (exists) throw new Exception(ModelException.ENTRY_ALREADY_EXISTS);

		const model = new UserIgnoredPet();
		Object.assign(model, { userId, petId });
		await model.save();
		return model;
	}
}
