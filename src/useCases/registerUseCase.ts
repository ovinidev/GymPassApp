import { UsersRepository } from '@repositories/usersRepository';
import { hash } from 'bcryptjs';
import { UserAlreadyExistsError } from './errors/userAlreadyExistsError';

interface registerUseCaseProps {
	email: string;
	name: string;
	password: string;
}

export class RegisterUseCase {
	constructor(private usersRepository: UsersRepository) {}

	async execute({ email, name, password }: registerUseCaseProps) {
		const userWithSameEmail = await this.usersRepository.findByEmail(email);

		if (userWithSameEmail) {
			throw new UserAlreadyExistsError();
		}

		const password_hash = await hash(password, 6);

		const user = await this.usersRepository.create({
			email,
			name,
			password_hash,
		});

		return user;
	}
}
