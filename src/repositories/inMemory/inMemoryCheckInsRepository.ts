import { CheckIn, Prisma } from '@prisma/client';
import { CheckInsRepository } from '@repositories/contracts/checkInsRepository';
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
		const checkInOnSameDate = this.checkIns.find(
			(checkIn) => checkIn.user_id === userId,
		);

		if (!checkInOnSameDate) return null;

		return checkInOnSameDate;
	}
}
