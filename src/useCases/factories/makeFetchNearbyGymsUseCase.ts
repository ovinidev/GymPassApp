import { PrismaGymsRepository } from '@repositories/prisma/prismaGymsRepository';
import { FetchNearbyGymsUseCase } from '@useCases/Gyms/FetchNearbyGymsUseCase';

export function makeFetchNearbyGymsUseCase() {
	const prismaGymsRepository = new PrismaGymsRepository();

	const fetchNearbyGymsUseCase = new FetchNearbyGymsUseCase(
		prismaGymsRepository,
	);

	return fetchNearbyGymsUseCase;
}
