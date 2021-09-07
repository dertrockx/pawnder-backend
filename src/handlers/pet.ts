import { Pet } from "@models";
import { AnimalTypeEnum, SexEnum, ActionEnum, errors } from "@constants";
import { getRepository } from "typeorm";

interface PetBody {
	institutionId: number;
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

export class PetHandler {
	async getPets(institutionId?: number | string): Promise<Pet[]> {
		const query = getRepository(Pet).createQueryBuilder("pet");
		if (institutionId)
			query.where("pet.institutionId = :institutionId", { institutionId });
		const pets = await query.getMany();
		return pets;
	}

	async getPet(id: number | string): Promise<Pet> {
		const pet = await Pet.findOne(id);
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
		return new Promise(async (resolve, reject) => {
			try {
				await pet.softRemove();
				resolve(true);
			} catch (err) {
				console.log(err);
				reject(false);
			}
		});
	}
}
