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

	async findById(id: string) {
		const gym = await prisma.gym.findUnique({
			where: {
				id,
			},
		});

		return gym;
	}

	async searchManyByName(name: string, page: number, pageLength: number) {
		const gyms = await prisma.gym.findMany({
			where: {
				name: {
					contains: name,
				},
			},
			skip: (page - 1) * pageLength,
			take: pageLength,
		});

		return gyms;
	}

	async findManyNearby({ latitude, longitude }: FindManyNearby) {
		const gyms = await prisma.$queryRaw<Gym[]>`
			SELECT * FROM gyms
			WHERE ( 6371 * acos( cos( radians(${latitude}) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(${longitude}) ) + sin( radians(${latitude}) ) * sin( radians( latitude ) ) ) ) <= 10
		`;

		return gyms;
	}
}
