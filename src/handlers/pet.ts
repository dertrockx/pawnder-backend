import { Pet, Photo, User, UserIgnoredPet } from "@models";
import { AnimalTypeEnum, SexEnum, ActionEnum, errors } from "@constants";
import { getRepository, getManager, EntityManager } from "typeorm";
import { distanceToDegConverter } from "@utils";
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
  nearby?: boolean;
  location?: {
    lat: number;
    long: number;
    distance: number;
  };
}
export class PetHandler {
  // CHANGE: make all fields in filter required
  async getPets(filters?: Filters): Promise<Pet[]> {
    // query to do left join
    // select pet.id from pet LEFT JOIN user_ignored_pet ON pet.id != user_ignored_pet.petId WHERE user_ignored_pet.userId = 4;
    // const query = getRepository(Pet).createQueryBuilder("pet");
    let pets: Pet[];
    // let query = getManager().createQueryBuilder().select("*").from(Pet, "pet");
    const query = getRepository(Pet).createQueryBuilder("pet");

    if (filters) {
      const {
        institutionId,
        animalType,
        userId,
        location,
        nearby = false,
      } = filters;

      if (nearby) {
        const { lat, long, distance } = location;
        const radius = distanceToDegConverter(distance);
        query
          .leftJoin("pet.institution", "institution")
          .where(
            "SQRT( POWER(locationLat - :centerLat, 2) + POWER(locationLong - :centerLong, 2) ) < :radius",
            {
              centerLat: lat,
              centerLong: long,
              radius,
            }
          );
      }
      if (userId) {
        const subQuery = getManager()
          .createQueryBuilder(UserIgnoredPet, "ignored")
          .select("petId")
          .where("ignored.userId = :userId", { userId });
        query.where(`pet.id NOT IN (${subQuery.getQuery()})`);
        console.log(query.getQuery());
        const pets = await query.getMany();
        console.log(pets);
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
    Object.assign(pet, { ...options });
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
