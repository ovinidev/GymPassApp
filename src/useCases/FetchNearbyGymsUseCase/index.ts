import { Gym } from '@prisma/client';
import { GymsRepository } from '@repositories/contracts/gymsRepository';
import { GymNotFoundError } from '@useCases/errors/gymNotFoundError';

interface FetchNearbyGymsUseCaseRequest {
	userLatitude: number;
	userLongitude: number;
}

interface FetchNearbyGymsUseCaseResponse {
	gyms: Gym[];
}

export class FetchNearbyGymsUseCase {
	constructor(private gymsRepository: GymsRepository) {}

	async execute({
		userLatitude,
		userLongitude,
	}: FetchNearbyGymsUseCaseRequest): Promise<FetchNearbyGymsUseCaseResponse> {
		const gyms = await this.gymsRepository.findManyNearby({
			latitude: userLatitude,
			longitude: userLongitude,
		});

		console.log('gyms');

		if (!gyms) throw new GymNotFoundError();

		return { gyms };
	}
}
