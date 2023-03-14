import { prisma } from '@services/prisma';
import { CheckIn, Prisma } from '@prisma/client';
import { CheckInsRepository } from '@repositories/contracts/checkInsRepository';

export class PrismaCheckInsRepository implements CheckInsRepository {
	async create({ gym_id, user_id }: Prisma.CheckInUncheckedCreateInput) {
		const checkIn = await prisma.checkIn.create({
			data: {
				gym_id,
				user_id,
			},
		});

		return checkIn;
	}

	async findByUserIdOnDate(userId: string, date: Date) {
		const checkIn = await prisma.checkIn.findUnique({
			select: {
				created_at: true,
				gym: true,
				gym_id: true,
				id: true,
				user: true,
				user_id: true,
				validated_at: true,
			},
			where: {
				id: userId,
			},
		});

		return checkIn;
	}

	findManyByUserId(userId: string, page: number): Promise<CheckIn[]> {
		throw new Error('Method not implemented.');
	}

	async countByUserId(userId: string): Promise<number> {
		const count = await prisma.checkIn.count({
			where: {
				id: userId,
			},
		});

		return count;
	}
}
