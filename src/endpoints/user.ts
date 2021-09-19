import { Router, Request, Response } from "express";
import { UserHandler } from "@handlers";
import { errors } from "@constants";
import { ActionEnum, AnimalTypeEnum, SexEnum } from '@constants';
import { ModelException } from '@constants';
import { files, validRequiredFields } from "@utils";

export const UserEndpoint = Router();

interface UserBody {
    email?: string;
	password?: string;
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

const getAllUsers = async (req: Request, res: Response) => {
	const handler = new UserHandler();
	const users = await handler.getUsers();
	return res.json({ users });
}

const getSingleUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    const handler = new UserHandler();
    try {
        const user = await handler.getUser(id);
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


const createUser = async (req: Request<any, any, UserBody, any>, res: Response) => {
	const { email, password, firstName, middleName, lastName, birthDate, sex, photoUrl, contactNumber, locationLat, locationLong, preferredAnimal, action, preferredDistance } = req.body;
	const {body} = req;
	if (!email || !password || !firstName || !middleName || !lastName || !birthDate || !sex || !photoUrl || !contactNumber || !locationLat || !locationLong || !preferredAnimal || !action || !preferredDistance) {
		return res.status(400).json({
			msg: "email, password, firstName, middleName, lastName, birthDate, sex, photoUrl, contactNumber, locationLat, locationLong, preferredAnimal, action, preferredDistance are required in body",
		});
	}
    const handler = new UserHandler();
    try {
        const user = await handler.create(email, body);
        return res.status(201).json({ user });
    } catch (error) {
		console.log(error);
        if (error.code === ModelException.USER_ALREADY_EXISTS) {
            return res.status(400).json(error);
        }
		return res.status(500).json({ msg: "Server error. Please contact admin" });
    }
};

UserEndpoint.get('/', getAllUsers);        //api/0.1/user/
UserEndpoint.get('/:id', getSingleUser);
UserEndpoint.put('/:id', updateUser);
UserEndpoint.delete('/:id', deleteUser);
UserEndpoint.post('/', createUser);			//for signup