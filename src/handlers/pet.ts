import { Pet, Photo, UserIgnoredPet } from "@models";
import { AnimalTypeEnum, SexEnum, ActionEnum, errors } from "@constants";
import { getRepository, getManager, EntityManager } from "typeorm";

export interface PetBody {
	institutionId: number | string;
	name: string;
	weight: number;
	height: number;
	age: number;
	breed: string;
	medicalHistory: string;
	otherInfo: string;
	animalType: AnimalTypeEnum;
	sex: SexEnum;
	action: ActionEnum;
}

export interface Filters {
	userId?: string | number;
	animalType?: AnimalTypeEnum;
	institutionId?: string | number;
}
export class PetHandler {
	async getPets(filters?: Filters): Promise<Pet[]> {
		// query to do left join
		// select pet.id from pet LEFT JOIN user_ignored_pet ON pet.id != user_ignored_pet.petId WHERE user_ignored_pet.userId = 4;
		// const query = getRepository(Pet).createQueryBuilder("pet");
		let pets: Pet[];
		// let query = getManager().createQueryBuilder().select("*").from(Pet, "pet");
		const query = getRepository(Pet).createQueryBuilder("pet");

		if (filters) {
			const { institutionId, animalType, userId } = filters;
			if (userId) {
				query.leftJoin("pet.ignorees", "ignored", "pet.id != ignored.petId");
				// .where("ignored.userId != :userId", { userId });
			}
			if (institutionId) {
				query.andWhere("pet.institutionId = :institutionId", { institutionId });
			}
			if (animalType) {
				query.andWhere("pet.animalType = :animalType", { animalType });
			}
		}

		pets = await query.getMany();
		return pets;
	}

	async getPet(id: number | string): Promise<Pet> {
		const pet = await Pet.findOne(id);
		if (!pet) throw new Error(errors.NOT_FOUND);
		return pet;
	}

	async create(options: PetBody): Promise<Pet> {
		const pet = new Pet();
		Object.assign(pet, options);
		await pet.save();
		return pet;
	}

	async update(id: number | string, options: Partial<PetBody>): Promise<Pet> {
		const pet = await Pet.findOne(id);
		if (!pet) throw new Error(errors.NOT_FOUND);
		Object.assign(pet, options);
		await pet.save();
		return pet;
	}

	async delete(id: number | string): Promise<boolean> {
		const pet = await Pet.findOne(id);
		if (!pet) throw new Error(errors.NOT_FOUND);
		await pet.softRemove();
		return true;
	}
}
