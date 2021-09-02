import { Router, Request, Response } from "express";
import { UserHandler } from "@handlers";
import { errors } from "@constants";
import { ActionEnum, AnimalTypeEnum, SexEnum } from '@constants';

export const UserEndpoint = Router();

interface UserBody {
    email?: string;
    firstName?: string;
    middleName?: string;
    lastName?: string;
    birthDate?: Date;
    sex?: SexEnum;
    photoUrl?: string;
    contactNumber?: string;
    locationLat?: number;
    locationLong?: number;
    preferredAnimal?: AnimalTypeEnum;
    action?: ActionEnum;
    preferredDistance?: number;
}

const getSingleUser = (req: Request, res: Response) => {
    const { id } = req.params;
    const handler = new UserHandler();
    try {
        const user = handler.getUser(id);
        return res.json({ user });

	} catch (err) {
		console.log(err);
		if (err.message === errors.NOT_FOUND)
			return res.status(404).json({ msg: "User not found" });
		return res.status(500).json({ msg: "Server error. Please contact admin" });
	}
};

const updateUser = async (
	req: Request<any, any, UserBody, any>,
	res: Response) => {
	const { id } = req.params;
	const handler = new UserHandler();
	try {
		const user = await handler.update(id, req.body);

		return res.json({ user });
	} catch (err) {
		console.log(err);
		if (err.message === errors.NOT_FOUND)
			return res.status(404).json({ msg: "User not found" });

		return res.status(500).json({ msg: "Server error. Please contact admin" });
	}
};

const deleteUser = async (req: Request, res: Response) => {
	const { id } = req.params;

	const handler = new UserHandler();
	try {
		const user = await handler.delete(id);
		return res.json({
			msg: `User '(${id}):${user.firstName} ${user.lastName}' successfully deleted`,
		});
	} catch (err) {
		console.log(err);
		if (err.message === errors.NOT_FOUND)
			return res.status(404).json({ msg: "User not found" });

		return res.status(500).json({ msg: "Server error. Please contact admin" });
	}
};

UserEndpoint.get('/:id', getSingleUser);        //api/0.1/user/
UserEndpoint.put('/:id', updateUser);
UserEndpoint.delete('/:id', deleteUser);