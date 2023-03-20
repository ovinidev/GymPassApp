import { User } from '@prisma/client';
import { UsersRepository } from '@repositories/contracts/usersRepository';
import { InvalidCredentialError } from '@useCases/errors/invalidCredentialError';
import { compare } from 'bcryptjs';

interface AuthenticateUseCaseRequest {
	email: string;
	password: string;
}

interface AuthenticateUseCaseResponse {
	user: User;
}

export class AuthenticateUseCase {
	constructor(private usersRepository: UsersRepository) {}

	async execute({
		email,
		password,
	}: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseResponse> {
		const user = await this.usersRepository.findByEmail(email);

		if (!user) throw new InvalidCredentialError();

		const isPasswordMatched = await compare(password, user.password_hash);

		if (!isPasswordMatched) throw new InvalidCredentialError();

		return { user };
	}
}
