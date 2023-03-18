import { User } from '@prisma/client';
import { UsersRepository } from '@repositories/contracts/usersRepository';
import { UserNotFoundError } from '@useCases/errors/userNotFoundError';

interface GetUserProfileUseCaseRequest {
	userId: string;
}

interface GetUserProfileUseCaseResponse {
	user: User;
}

export class GetUserProfileUseCase {
	constructor(private usersRepository: UsersRepository) {}

	async execute({
		userId,
	}: GetUserProfileUseCaseRequest): Promise<GetUserProfileUseCaseResponse> {
		const user = await this.usersRepository.findById(userId);

		if (!user) throw new UserNotFoundError();

		return { user };
	}
}
