import { PrismaUsersRepository } from '@repositories/prisma/prismaUsersRepository';
import { GetUserProfileUseCase } from '@useCases/getUserProfile';

export function makeGetUserProfileUseCase() {
	const prismaUsersRepository = new PrismaUsersRepository();
	const getUserProfileUseCase = new GetUserProfileUseCase(
		prismaUsersRepository,
	);

	return getUserProfileUseCase;
}
