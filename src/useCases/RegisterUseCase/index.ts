import { User } from '@prisma/client';
import { UsersRepository } from '@repositories/contracts/usersRepository';
import { hash } from 'bcryptjs';
import { UserAlreadyExistsError } from '../errors/userAlreadyExistsError';

interface RegisterUseCaseRequest {
	email: string;
	name: string;
	password: string;
}

interface RegisterUseCaseResponse {
	user: User;
}

export class RegisterUseCase {
	constructor(private usersRepository: UsersRepository) {}

	async execute({
		email,
		name,
		password,
	}: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {
		const userWithSameEmail = await this.usersRepository.findByEmail(email);

		if (userWithSameEmail) throw new UserAlreadyExistsError();

		const password_hash = await hash(password, 6);

		const user = await this.usersRepository.create({
			email,
			name,
			password_hash,
		});

		return { user };
	}
}
