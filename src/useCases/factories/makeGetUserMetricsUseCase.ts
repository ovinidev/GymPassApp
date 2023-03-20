import { PrismaCheckInsRepository } from '@repositories/prisma/prismaCheckInsRepository';
import { GetUserMetricsUseCase } from '@useCases/Users/GetUserMetricsUseCase';

export function makeGetUserMetricsUseCase() {
	const checkInsRepository = new PrismaCheckInsRepository();

	const getUserMetricsUseCase = new GetUserMetricsUseCase(checkInsRepository);

	return getUserMetricsUseCase;
}
