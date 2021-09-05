import { User } from '@models';
import { ActionEnum, AnimalTypeEnum, SexEnum } from '@constants';
import { errors } from "@constants";

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

export class UserHandler {
    async getUsers(): Promise<User[]> {
        const users = await User.find();
        return users;
    }

    async getUser(id: number | string): Promise<User> {
        const user = await User.findOne(id);
        if (!user) throw new Error(errors.NOT_FOUND);

        return user;
    }

    async update(id: number | string, options: UserBody) {
        const user = await User.findOne(id);
        if (!user) throw new Error(errors.NOT_FOUND);

        Object.assign(user, options);
        await user.save();

        return user;
    }

    async delete(id: number | string) {
        const user = await User.findOne(id);
        if (!user) throw new Error(errors.NOT_FOUND);

        await user.softRemove();
        return user;
    }
}
