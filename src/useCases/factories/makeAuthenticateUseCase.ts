import { PrismaUsersRepository } from '@repositories/prisma/prismaUsersRepository';
import { AuthenticateUseCase } from '@useCases/Users/AuthenticateUseCase';

export function makeAuthenticateUseCase() {
	const prismaUsersRepository = new PrismaUsersRepository();

	const authenticateUseCase = new AuthenticateUseCase(prismaUsersRepository);

	return authenticateUseCase;
}
