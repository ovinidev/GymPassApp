import { PrismaCheckInsRepository } from '@repositories/prisma/prismaCheckInsRepository';
import { FetchCheckInHistoryUseCase } from '@useCases/FetchCheckInHistoryUseCase';

export function makeFetchCheckInHistoryUseCase() {
	const checkInsRepository = new PrismaCheckInsRepository();

	const fetchCheckInHistoryUseCase = new FetchCheckInHistoryUseCase(
		checkInsRepository,
	);

	return fetchCheckInHistoryUseCase;
}
