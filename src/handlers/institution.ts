import { getManager } from "typeorm";
import { Institution } from "@models";
import { distanceToDegConverter } from "@utils";
import { errors, Exception, ModelException } from "@constants";
// SQL Query
// "SQRT( POWER(locationLat - :centerLat, 2) + POWER(locationLong - :centerLong, 2) ) < :radius",

interface InstitutionBody {
	name?: string;
	email?: string;
	password?: string;
	description?: string;
	locationLat?: string;
	locationLong?: string;
	contactNumber?: string;
	photoURL?: string;
}

export class InstitutionHandler {
	async getInstitutions(): Promise<Institution[]> {
		const institutions = await Institution.find();
		return institutions;
	}

	async getNearbyInstitutions(
		center: { lat: number; long: number },
		distance: number
	): Promise<Institution[]> {
		const { lat, long } = center;
		const radius = distanceToDegConverter(distance);
		const institutions = await getManager()
			.createQueryBuilder(Institution, "institution")
			.where(
				"SQRT( POWER(locationLat - :centerLat, 2) + POWER(locationLong - :centerLong, 2) ) < :radius",
				{
					centerLat: lat,
					centerLong: long,
					radius,
				}
			)
			.getMany();

		return institutions;
	}

	async getInstitution(id: number | string): Promise<Institution> {
		const institution = await Institution.findOne(id);
		if (!institution) throw new Error(errors.NOT_FOUND);
		return institution;
	}

	async create(email: string, options: InstitutionBody) {
		const institutionExists = await Institution.findOne({email});
		if (institutionExists) throw new Exception(ModelException.INSTITUTION_ALREADY_EXISTS);
		
		const institution = new Institution();
		Object.assign(institution, options);

		await institution.save();

		return institution;
	}

	async update(id: number | string, options: InstitutionBody) {
		const institution = await Institution.findOne(id);
		if (!institution) throw new Error(errors.NOT_FOUND);

		Object.assign(institution, options);

		await institution.save();

		return institution;
	}

	async delete(id: number | string) {
		const institution = await Institution.findOne(id);
		if (!institution) throw new Error(errors.NOT_FOUND);

		await institution.softRemove();

		return institution;
	}
}
