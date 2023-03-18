import { getDistanceBetweenCoordinate } from '@/utils/getDistanceBetweenCoordinate';
import { Gym, Prisma } from '@prisma/client';
import {
	FindManyNearby,
	GymsRepository,
} from '@repositories/contracts/gymsRepository';
import { randomUUID } from 'node:crypto';

export class InMemoryGymsRepository implements GymsRepository {
	gyms: Gym[] = [];

	async create(data: Prisma.GymCreateInput) {
		const gym = {
			name: data.name,
			description: data.description,
			id: data.id ? data.id : randomUUID(),
			latitude: data.latitude,
			longitude: data.longitude,
			phone: data.phone,
		} as Gym;

		this.gyms.push(gym);

		return gym;
	}

	async findById(id: string) {
		const gym = this.gyms.find((gym) => {
			return gym.id === id;
		});

		if (!gym) return null;

		return gym;
	}

	async searchManyByName(
		name: string,
		page: number,
		pageLength: number,
	): Promise<Gym[] | null> {
		const gym = this.gyms
			.filter((gym) => {
				return gym.name === name;
			})
			.slice((page - 1) * pageLength, page * pageLength);

		if (gym.length === 0) return null;

		return gym;
	}

	async findManyNearby(coordinates: FindManyNearby) {
		const gymsNearby = this.gyms.filter((gym) => {
			const distance = getDistanceBetweenCoordinate(
				{
					latitude: coordinates.latitude,
					longitude: coordinates.longitude,
				},
				{
					latitude: Number(gym.latitude),
					longitude: Number(gym.longitude),
				},
			);

			return distance <= 10;
		});

		return gymsNearby;
	}
}
