import { Request, Response, Router } from "express";
import { InstitutionHandler } from "@handlers";
import { Institution } from "models";

export const InstitutionEndpoint = Router();

interface GetNearbyInstitutionsQuery {
	nearby?: boolean;
	centerLat?: string;
	centerLong?: string;
	distance?: string;
}

interface InstitutionBody {
	name?: string;
	email?: string;
	locationLat?: string;
	locationLong?: string;
	contactNumber?: string;
}

const getInstitutions = async (
	req: Request<any, any, any, GetNearbyInstitutionsQuery>,
	res: Response
) => {
	let { nearby, centerLat, centerLong, distance } = req.query;

	const handler = new InstitutionHandler();
	let institutions: Institution[];
	try {
		if (nearby && (!centerLat || !centerLong || !distance))
			return res.status(400).json({
				msg: "Please make sure centerLat, centerLong, and distance are provided and are integers",
			});

		institutions = !nearby
			? await handler.getInstitutions()
			: await handler.getNearbyInstitutions(
					{
						lat: parseFloat(centerLat),
						long: parseFloat(centerLong),
					},
					parseFloat(distance)
			  );

		return res.json({ institutions, count: institutions.length });
	} catch (err) {
		console.log(err);
		return res.status(500).json({ msg: "Server error. Please contact admin" });
	}
};

const getSingleInstitution = async (req: Request, res: Response) => {
	const { id } = req.params;
	try {
		const institution = await Institution.findOne(id);

		if (!institution)
			return res.status(404).json({ msg: "Institution not found" });

		return res.json({ institution });
	} catch (err) {
		console.log(err);
		return res.status(500).json({ msg: "Server error. Please contact admin" });
	}
};

// TODO: still need to validate and sanitize data sent to this endpoint
const updateInstitution = async (
	req: Request<any, any, InstitutionBody, any>,
	res: Response
) => {
	const { id } = req.params;

	try {
		const institution = await Institution.findOne(id);

		if (!institution)
			return res.status(404).json({ msg: "Institution not found" });

		Object.assign(institution, { ...req.body });

		await institution.save();

		return res.json({ institution });
	} catch (err) {
		console.log(err);
		return res.status(500).json({ msg: "Server error. Please contact admin" });
	}
};

const deleteInstitution = async (req: Request, res: Response) => {
	const { id } = req.params;

	try {
		const institution = await Institution.findOne(id);

		if (!institution)
			return res.status(404).json({ msg: "Institution not found" });

		await institution.softRemove();

		return res.json({
			msg: `Institution '(${id}):${institution.name}' successfully deleted`,
		});
	} catch (err) {
		console.log(err);
		return res.status(500).json({ msg: "Server error. Please contact admin" });
	}
};

InstitutionEndpoint.get("/", getInstitutions);
InstitutionEndpoint.get("/:id", getSingleInstitution);
InstitutionEndpoint.put("/:id", updateInstitution);
InstitutionEndpoint.delete("/:id", deleteInstitution);
