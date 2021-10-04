import { Application, User, Pet } from "@models";
import { getRepository, getManager } from "typeorm";
import { errors, ApplicationStatusEnum } from "@constants";

export interface ApplicationFilters {
  petId?: string | number;
}

export interface ApplicationBody {
  userId: string | number;
  petId: string | number;
  status?: ApplicationStatusEnum;
}

export class ApplicationHandler {
  async list(filters?: ApplicationFilters): Promise<Application[]> {
    const { petId } = filters;
    let applications: Application[];
    const query = getManager()
      .createQueryBuilder(Application, "a")
      .select("a.id", "id")
      .addSelect("a.createdAt", "createdAt")
      .addSelect("a.updatedAt", "updatedAt")
      .addSelect("a.petId", "petId")
      .addSelect("a.status", "status")
      .addSelect("u.firstName", "firstName")
      .addSelect("u.lastName", "lastName")
      .addSelect("u.middleName", "middleName")
      .addSelect("u.middleName", "middleName")
      .addSelect("u.email", "email")
      .addSelect("u.contactNumber", "contactNumber")
      .addSelect("u.photoUrl", "photoUrl")
      .addSelect("u.locationLat", "locationLat")
      .addSelect("u.locationLong", "locationLong")
      .addSelect("u.birthDate", "birthDate")
      .leftJoin(User, "u", "u.id = a.userId")
      .groupBy("id");
    // const query = getRepository(Application)
    // 	.createQueryBuilder("application")
    // 	.leftJoin(User, "user", "application.userId = user.id");

    if (petId) query.where("a.petId = :petId", { petId });

    applications = await query.getRawMany();

    return applications;
  }

  /**
   * internally it is called by update() and delete()
   */
  async get(id: string | number): Promise<Application> {
    const application = await Application.findOne(id);
    if (!application) throw new Error(errors.NOT_FOUND);
    return application;
  }

  async create(options: ApplicationBody): Promise<Application> {
    const { petId, userId, status = ApplicationStatusEnum.Pending } = options;
    // check first if pet and user exists
    const pet = await Pet.findOne(petId);
    if (!pet) {
      console.error(`Pet with id ${petId} not found!`);
      throw new Error(errors.NOT_FOUND);
    }
    const user = await User.findOne(userId);
    if (!user) {
      console.error(`User with id ${userId} not found!`);
      throw new Error(errors.NOT_FOUND);
    }
    const application = new Application();
    Object.assign(application, options);
    await application.save();
    return application;
  }

  /**
   * internally it calls this.get()
   * @param id identifier of application (i.e. the primary key)
   * @param status pending | deleted | under review | rejected | accepted
   * @returns an application object
   */
  async update(
    id: string | number,
    status: ApplicationStatusEnum
  ): Promise<Application> {
    const application = await this.get(id);
    Object.assign(application, { status });
    await application.save();
    return application;
  }

  /**
   * internally it calls this.get()
   */
  async delete(id: string | number): Promise<void> {
    const application = await this.get(id);
    await application.softRemove();
  }
}
