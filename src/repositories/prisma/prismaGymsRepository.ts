import { prisma } from '@services/prisma';
import { Gym, Prisma } from '@prisma/client';
import {
	FindManyNearby,
	GymsRepository,
} from '@repositories/contracts/gymsRepository';

export class PrismaGymsRepository implements GymsRepository {
	async create(data: Prisma.GymCreateInput) {
		const gym = await prisma.gym.create({
			data: data,
		});

		return gym;
	}

	async findById(id: string): Promise<Gym | null> {
		const gym = await prisma.gym.findUnique({
			where: {
				id,
			},
		});

		return gym;
	}

	searchManyByName(
		name: string,
		page: number,
		pageLength: number,
	): Promise<Gym[] | null> {
		throw new Error('Method not implemented.');
	}

	findManyNearby(coordinates: FindManyNearby): Promise<Gym[]> {
		throw new Error('Method not implemented.');
	}
}
