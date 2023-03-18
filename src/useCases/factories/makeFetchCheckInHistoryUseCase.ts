import { PrismaCheckInsRepository } from '@repositories/prisma/prismaCheckInsRepository';
import { FetchCheckInHistory } from '@useCases/FetchCheckInHistoryUseCase';

export function makeFetchCheckInHistoryUseCase() {
	const checkInsRepository = new PrismaCheckInsRepository();

	const fetchCheckInHistoryUseCase = new FetchCheckInHistory(
		checkInsRepository,
	);

	return fetchCheckInHistoryUseCase;
}
