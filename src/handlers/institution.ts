import { getManager, In } from "typeorm";
import { Institution } from "models";
import { distanceToDegConverter } from "utils";

// SQL Query
// "SQRT( POWER(locationLat - :centerLat, 2) + POWER(locationLong - :centerLong, 2) ) < :radius",
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
}
