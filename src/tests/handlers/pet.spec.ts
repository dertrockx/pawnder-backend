import { PetHandler } from "@handlers";
import { Pet } from "@models";
import { EntityManager, getManager, getRepository } from "typeorm";
import { errors, AnimalTypeEnum, ActionEnum, SexEnum } from "@constants";

describe("TagHandler", () => {
	let manager: EntityManager;
	const handler = new PetHandler();

	beforeAll(async () => {
		manager = getManager();

		await manager.query("DELETE FROM pet");
		await manager.query("ALTER TABLE pet AUTO_INCREMENT = 1");

		const query = `
      INSERT INTO
				pet (institutionId, name, weight, height, age, breed, animalType, medicalHistory, sex, otherInfo, action)
			VALUES
				(1, 'due30', 5, 5, 25, 'chinese tuta', '${AnimalTypeEnum.Dogs}', 'Some medical history', 'm', 'some other info', 'adopt'),
				(1, 'hari roke', 5, 5, 25, 'belgian waffle', '${AnimalTypeEnum.Dogs}', 'Some medical history', 'm', 'some other info', 'foster'),
				(2, 'salvador panelo', 5, 5, 25, 'lizard of oz', '${AnimalTypeEnum.ReptAndAmphib}', 'Some medical history', 'f', 'some other info', 'adopt'),
				(2, 'bong-kun', 5, 5, 25, 'petite waifu', '${AnimalTypeEnum.ExoticPets}', 'Some medical history', 'f', 'some other info', 'foster'),
				(3, 'little duque', 5, 5, 25, 'tilapya', '${AnimalTypeEnum.FishAndAquariums}', 'Some medical history', 'f', 'some other info', 'adopt'),
				(3, 'bato dela rose', 5, 5, 25, 'stone', '${AnimalTypeEnum.Rodents}', 'Some medical history', 'f', 'some other info', 'foster'),
				(4, 'glorya', 5, 5, 25, 'cat woman', '${AnimalTypeEnum.Cats}', 'Some medical history', 'f', 'some other info', 'adopt'),
				(4, 'bong-bong-marks', 5, 5, 25, 'nightstalker', '${AnimalTypeEnum.Rabbits}', 'Some medical history', 'f', 'some other info', 'foster')
    `;

		await manager.query(query);
	});

	describe("Get all pets", () => {
		let pets: Pet[];

		beforeAll(async () => {
			pets = await handler.getPets();
		});

		it("should get all pets", () => {
			expect(pets).toHaveLength(8);
		});
	});

	describe("Get all pets with filters", () => {
		let pets1: Pet[]; // Pets with institutionId 1
		let pets2: Pet[]; // Pets with institutionId 2
		let pets3: Pet[]; // Pets with institutionId 3
		let pets4: Pet[]; // Pets with institutionId 4
		let dogs: Pet[];
		let reptilesAndAmphibs: Pet[];
		let exoticPets: Pet[];

		beforeAll(async () => {
			// TODO: get pets with filters

			pets1 = await handler.getPets({ institutionId: 1 });
			pets2 = await handler.getPets({ institutionId: 2 });
			pets3 = await handler.getPets({ institutionId: 3 });
			pets4 = await handler.getPets({ institutionId: 4 });

			dogs = await handler.getPets({ animalType: AnimalTypeEnum.Dogs });
			reptilesAndAmphibs = await handler.getPets({
				animalType: AnimalTypeEnum.ReptAndAmphib,
			});
			exoticPets = await handler.getPets({
				animalType: AnimalTypeEnum.ExoticPets,
			});
		});

		it("should get all pets with institutionId = 1", () => {
			expect(pets1).toHaveLength(2);
		});

		it("should get all pets with institutionId = 2", () => {
			expect(pets2).toHaveLength(2);
		});

		it("should get all pets with institutionId = 3", () => {
			expect(pets3).toHaveLength(2);
		});

		it("should get all pets with institutionId = 4", () => {
			expect(pets4).toHaveLength(2);
		});

		it("should get all dogs", () => {
			expect(dogs).toHaveLength(2);
		});
		it("should get all reptiles and amphibians", () => {
			expect(reptilesAndAmphibs).toHaveLength(1);
		});
		it("should get all exotic pets", () => {
			expect(exoticPets).toHaveLength(1);
		});
	});

	describe("Get a single pet", () => {
		let pet: Pet;

		beforeAll(async () => {
			pet = await handler.getPet(1);
		});

		it("should return first pet", () => {
			expect(pet).toBeTruthy();
		});
	});

	describe("Update first pet", () => {
		let pet: Pet;

		beforeAll(async () => {
			pet = await handler.update(1, {
				name: "name updated",
				animalType: AnimalTypeEnum.Rabbits,
			});
		});

		it("should update first pet", () => {
			expect(pet.name).toBe("name updated");
			expect(pet.animalType).toBe(AnimalTypeEnum.Rabbits);
		});
	});

	describe("Delete first pet", () => {
		beforeAll(async () => {
			await handler.delete(1);
		});

		it("should not return when queried", () => {
			expect(handler.getPet(1)).rejects.toThrow(errors.NOT_FOUND);
		});
	});

	afterAll(async () => {
		await manager.query("DELETE FROM pet");
		await manager.query("ALTER TABLE pet AUTO_INCREMENT = 1");
	});
});
