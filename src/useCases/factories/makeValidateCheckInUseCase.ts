import { PrismaCheckInsRepository } from '@repositories/prisma/prismaCheckInsRepository';
import { ValidateCheckInUseCase } from '@useCases/ValidateCheckInUseCase';

export function makeValidateCheckInUseCase() {
	const checkInsRepository = new PrismaCheckInsRepository();

	const validateCheckInUseCase = new ValidateCheckInUseCase(checkInsRepository);

	return validateCheckInUseCase;
}
