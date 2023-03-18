import { PrismaUsersRepository } from '@repositories/prisma/prismaUsersRepository';
import { RegisterUseCase } from '@useCases/RegisterUseCase';

export function makeRegisterUseCase() {
	const prismaUsersRepository = new PrismaUsersRepository();

	const registerUseCase = new RegisterUseCase(prismaUsersRepository);

	return registerUseCase;
}
