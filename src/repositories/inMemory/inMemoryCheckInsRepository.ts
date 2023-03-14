import { CheckIn, Prisma } from '@prisma/client';
import { CheckInsRepository } from '@repositories/contracts/checkInsRepository';
import dayjs from 'dayjs';
import { randomUUID } from 'node:crypto';

export class inMemoryCheckInsRepository implements CheckInsRepository {
	checkIns: CheckIn[] = [];

	async create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn> {
		const checkIn = {
			created_at: new Date(),
			gym_id: data.gym_id,
			id: randomUUID(),
			user_id: data.user_id,
			validated_at: data.validated_at ? new Date(data.validated_at) : null,
		} as CheckIn;

		this.checkIns.push(checkIn);

		return checkIn;
	}

	async findByUserIdOnDate(
		userId: string,
		date: Date,
	): Promise<CheckIn | null> {
		const startOfTheCurrentData = dayjs(date).startOf('date');
		const endOfTheCurrentData = dayjs(date).endOf('date');

		const checkInOnSameDate = this.checkIns.find((checkIn) => {
			const checkInCreatedAt = dayjs(checkIn.created_at);

			const isOnSameDate =
				checkInCreatedAt.isAfter(startOfTheCurrentData) &&
				checkInCreatedAt.isBefore(endOfTheCurrentData);

			if (isOnSameDate) return checkIn.user_id === userId;
		});

		if (!checkInOnSameDate) return null;

		return checkInOnSameDate;
	}

	async findManyByUserId(
		userId: string,
		page: number,
		pageLength: number,
	): Promise<CheckIn[]> {
		const checkIns = this.checkIns
			.filter((checkIn) => checkIn.user_id === userId)
			.slice((page - 1) * pageLength, page * pageLength);

		return checkIns;
	}

	async countByUserId(userId: string): Promise<number> {
		const checkIns = this.checkIns.filter(
			(checkIn) => checkIn.user_id === userId,
		).length;

		return checkIns;
	}
}
