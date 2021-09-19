import { Photo } from "@models";
import { errors, PhotoOwnerEnum, PetPhotoTypeEnum } from "@constants";

export interface PhotoBody {
	petId: number;
	url: string;
	type: PetPhotoTypeEnum;
	owner: PhotoOwnerEnum;
}

export class PhotoHandler {
	// count pet's photos
	async count(petId: number): Promise<number> {
		const [_, count] = await Photo.findAndCount({ petId });
		return count;
	}

	async list(filter: { petId?: number }): Promise<Photo[]> {
		const { petId } = filter;
		const photos = await Photo.find({ petId });
		return photos;
	}
	async get(id: number | string): Promise<Photo> {
		const photo = await Photo.findOne(id);
		if (!photo) throw new Error(errors.NOT_FOUND);
		return photo;
	}

	async create(options: PhotoBody): Promise<Photo> {
		const photo = new Photo();
		Object.assign(photo, { ...options });
		await photo.save();
		return photo;
	}

	async createMultiple(options: {
		petId: number | string;
		urls: {
			main: string;
			others: string[];
		};
	}): Promise<Photo[]> {
		const {
			petId,
			urls: { main, others },
		} = options;

		//  create other photos
		const photos = others.map((url) => {
			const photo = new Photo();
			Object.assign(photo, { petId, url, type: PetPhotoTypeEnum.Other });
			return photo;
		});

		const mainPhoto = new Photo();
		Object.assign(mainPhoto, { petId, url: main, type: PetPhotoTypeEnum.Main });
		photos.push(mainPhoto);

		await Photo.save(photos);
		return photos;
	}

	// internally call get()
	async update(id: number | string, url: string): Promise<Photo> {
		const photo = await this.get(id);
		Object.assign(photo, { url });
		await photo.save();
		return photo;
	}

	async updateMultiple(
		photos: [{ id: number | string; url: string }]
	): Promise<Photo[]> {
		const newPhotos: Photo[] = [];
		for (const { id, url } of photos) {
			const photo = await this.get(id);
			Object.assign(photo, { url });
			newPhotos.push(photo);
		}
		await Photo.save(newPhotos);
		return newPhotos;
	}

	async delete(id: number | string): Promise<boolean> {
		const photo = await this.get(id);
		await photo.softRemove();
		return true;
	}

	async deletePetPhotos(petId: number): Promise<boolean> {
		const photos = await Photo.find({ petId });
		const photoPromises = photos.map((photo) => photo.softRemove());
		await Promise.all(photoPromises);
		return true;
	}
}
