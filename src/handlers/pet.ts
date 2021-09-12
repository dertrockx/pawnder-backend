import { Pet, Photo } from "@models";
import { AnimalTypeEnum, SexEnum, ActionEnum, errors } from "@constants";
import { getRepository } from "typeorm";

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

export type Filters = Partial<Pick<PetBody, "institutionId" | "animalType">>;

export class PetHandler {
	async getPets(filters?: Filters): Promise<Pet[]> {
		const query = getRepository(Pet).createQueryBuilder("pet");
		let pets: Pet[];
		if (filters) {
			const { institutionId, animalType } = filters;
			if (institutionId) {
				query.where("pet.institutionId = :institutionId", { institutionId });
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
