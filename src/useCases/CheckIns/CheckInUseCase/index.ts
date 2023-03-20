import { getDistanceBetweenCoordinate } from '@/utils/getDistanceBetweenCoordinate';
import { CheckIn } from '@prisma/client';
import { CheckInsRepository } from '@repositories/contracts/checkInsRepository';
import { GymsRepository } from '@repositories/contracts/gymsRepository';
import { GymNotFoundError } from '@useCases/errors/gymNotFoundError';
import { CheckInSameDayError } from '@useCases/errors/checkInSameDayError';
import { MaxDistanceError } from '@useCases/errors/maxDistanceError';

interface CheckInUseCaseRequest {
	userId: string;
	gymId: string;
	userLatitude: number;
	userLongitude: number;
}

interface CheckInUseCaseResponse {
	checkIn: CheckIn;
}

export class CheckInUseCase {
	constructor(
		private checkInsRepository: CheckInsRepository,
		private gymsRepository: GymsRepository,
	) {}

	async execute({
		gymId,
		userId,
		userLatitude,
		userLongitude,
	}: CheckInUseCaseRequest): Promise<CheckInUseCaseResponse> {
		const gym = await this.gymsRepository.findById(gymId);

		if (!gym) throw new GymNotFoundError();

		const userCoordinate = {
			latitude: userLatitude,
			longitude: userLongitude,
		};

		const gymCoordinate = {
			latitude: Number(gym.latitude),
			longitude: Number(gym.longitude),
		};

		const distanceBetweenCoordinate = getDistanceBetweenCoordinate(
			userCoordinate,
			gymCoordinate,
		);

		const MAX_DISTANCE_IN_KILOMETERS = 0.1;

		if (distanceBetweenCoordinate > MAX_DISTANCE_IN_KILOMETERS) {
			throw new MaxDistanceError();
		}

		const checkInOnSameDay = await this.checkInsRepository.findByUserIdOnDate(
			userId,
			new Date(),
		);

		if (checkInOnSameDay) throw new CheckInSameDayError();

		const checkIn = await this.checkInsRepository.create({
			gym_id: gymId,
			user_id: userId,
		});

		return {
			checkIn,
		};
	}
}
