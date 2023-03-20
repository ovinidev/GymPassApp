import { PrismaGymsRepository } from '@repositories/prisma/prismaGymsRepository';
import { SearchGymsUseCase } from '@useCases/Gyms/SearchGymsUseCase';

export function makeSearchGymsUseCase() {
	const prismaGymsRepository = new PrismaGymsRepository();

	const searchGymsUseCase = new SearchGymsUseCase(prismaGymsRepository);

	return searchGymsUseCase;
}
