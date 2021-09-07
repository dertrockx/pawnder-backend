import { connection } from "./config/database";
import { User, Pet, Institution } from "@models";
import { ActionEnum, AnimalTypeEnum, SexEnum } from "@constants";
import {
	name,
	image,
	phone,
	random,
	address,
	datatype,
	internet,
	date,
	company,
	lorem,
} from "faker";

const getEntryFromEnum = (anyEnum: any) =>
	random.arrayElement(Object.values(anyEnum));

const generateDummyUser = async (): Promise<User> => {
	const user = new User();

	const sex = Math.floor(Math.random() * 2);

	const firstName = name.firstName(sex);
	const middleName = name.middleName(sex);
	const lastName = name.lastName(sex);

	Object.assign(user, {
		firstName,
		lastName,
		middleName,
		email: internet.email(firstName, lastName),
		sex: sex > 0 ? SexEnum.Male : SexEnum.Female,
		birthDate: date.between("01/01/1990", new Date()),
		photoUrl: image.image(),
		contactNumber: phone.phoneNumber("+639#########"),
		locationLat: address.latitude(),
		locationLong: address.longitude(),
		preferredAnimal: getEntryFromEnum(AnimalTypeEnum),
		action: getEntryFromEnum(ActionEnum),
		preferredDistance: datatype.float(),
	});

	await user.save();
	return user;
};

const generateDummyInstitution = async (): Promise<Institution> => {
	const institution = new Institution();
	const instiName = company.companyName();
	Object.assign(institution, {
		name: instiName,
		locationLat: address.latitude(),
		locationLong: address.longitude(),
		email: internet.email(instiName, ""),
		contactNumber: phone.phoneNumber("+639#########"),
		description: lorem.sentences(3),
	});
	await institution.save();
	return institution;
};

const generateDummyPet = async (institutionId: number): Promise<Pet> => {
	const pet = new Pet();

	Object.assign(pet, {
		institutionId,
		name: "Bantay",
		weight: Math.floor(Math.random() * (30.0 - 0.1) + 0.1),
		height: Math.floor(Math.random() * (10.0 - 0.1) + 0.1),
		age: Math.floor(Math.random() * 10),
		breed: "any breed",
		animalType: getEntryFromEnum(AnimalTypeEnum),
		medicalHistory: "#Med history dito\n**in markdown format**",
		photoUrl: image.animals(),
		sex: getEntryFromEnum(SexEnum),
		otherInfo: "Custom other info",
		action: getEntryFromEnum(ActionEnum),
	});
	await pet.save();
	return pet;
};

connection()
	.then(async () => {
		for (let i = 0; i < 3; i++) {
			try {
				const user = await generateDummyUser();
				console.log(`created user ${user.id} ${user.firstName}`);
				const institution = await generateDummyInstitution();
				console.log(
					`created institution ${institution.name} (${institution.id})`
				);
				for (let i = 0; i < 5; i++) {
					const pet = await generateDummyPet(institution.id);
					console.log(
						`created pet ${pet.name} (${pet.id}) for institution ${institution.id}`
					);
				}
			} catch (err) {
				console.log(err);
			}
			if (i === 2) process.exit(0);
		}
	})
	.catch((err) => console.log(err));
