import { prisma } from '@services/prisma';
import { CheckIn, Prisma } from '@prisma/client';
import { CheckInsRepository } from '@repositories/contracts/checkInsRepository';
import dayjs from 'dayjs';

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
		const startOfTheCurrentData = dayjs(date).startOf('date');
		const endOfTheCurrentData = dayjs(date).endOf('date');

		const checkIn = await prisma.checkIn.findFirst({
			where: {
				user_id: userId,
				created_at: {
					gte: startOfTheCurrentData.toDate(),
					lte: endOfTheCurrentData.toDate(),
				},
			},
		});

		return checkIn;
	}

	async findManyByUserId(userId: string, page: number, pageLength: number) {
		const checkIn = await prisma.checkIn.findMany({
			where: {
				user_id: userId,
			},
			take: pageLength,
			skip: (page - 1) * pageLength,
		});

		return checkIn;
	}

	async countByUserId(userId: string) {
		const count = await prisma.checkIn.count({
			where: {
				user_id: userId,
			},
		});

		return count;
	}

	async findById(id: string) {
		const checkIn = await prisma.checkIn.findUnique({
			where: {
				id,
			},
		});

		return checkIn;
	}

	async save(data: CheckIn) {
		const checkIn = await prisma.checkIn.update({
			where: {
				id: data.id,
			},
			data: data,
		});

		return checkIn;
	}
}
