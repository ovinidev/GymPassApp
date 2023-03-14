import { Gym } from '@prisma/client';
import { GymsRepository } from '@repositories/contracts/gymsRepository';
import { GymNotFoundError } from '@useCases/errors/gymNotFoundError';

interface SearchGymsUseCaseRequest {
	name: string;
	page: number;
	pageLength: number;
}

interface SearchGymsUseCaseResponse {
	gyms: Gym[];
}

export class SearchGymsUseCase {
	constructor(private gymsRepository: GymsRepository) {}

	async execute({
		name,
		page,
		pageLength,
	}: SearchGymsUseCaseRequest): Promise<SearchGymsUseCaseResponse> {
		const gyms = await this.gymsRepository.searchManyByName(
			name,
			page,
			pageLength,
		);

		if (!gyms) throw new GymNotFoundError();

		return { gyms };
	}
}
