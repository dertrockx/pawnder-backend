import { PetHandler } from "@handlers";
import { Pet } from "@models";
import { EntityManager, getManager } from "typeorm";
import { errors } from "@constants";

describe("Pet Handler", () => {
	let manager: EntityManager;
	const handler = new PetHandler();

	beforeAll(async () => {
		// first of all clear all seeded-value

		manager = getManager();

		await manager.query("DELETE FROM pet");
		await manager.query("ALTER TABLE pet AUTO_INCREMENT = 1");

		// then generate new dummy data

		const query = `
      INSERT INTO pet 
        (institutionId, name, weight, height, age, breed, animalType, medicalHistory, sex, otherInfo, action)
      VALUES
        (1, 'due30', 5, 5, 25, 'chinese dog', 'dogs', 'Some medical history', 'm', 'some other info', 'adopt'),
        (1, 'hari roke', 5, 5, 25, 'belgian waffle', 'dogs', 'Some medical history', 'm', 'some other info', 'foster'),
        (2, 'salbador panelo', 5, 5, 25, 'lizard of oz', 'reptiles and amphibians', 'Some medical history', 'm', 'some other info', 'foster')
    `;

		await manager.query(query);
	});

	describe("Get all pets", () => {
		let pets: Pet[];

		beforeAll(async () => {
			pets = await handler.getPets();
		});

		it("should return all pets", () => {
			expect(pets).toHaveLength(3);
		});
	});

	afterAll(async () => {
		await manager.query("DELETE FROM pet");
		await manager.query("ALTER TABLE pet AUTO_INCREMENT = 1");
	});
});
