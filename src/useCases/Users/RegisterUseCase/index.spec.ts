import { InMemoryUsersRepository } from '@repositories/inMemory/inMemoryUsersRepository';
import { UsersRepository } from '@repositories/contracts/usersRepository';
import { UserAlreadyExistsError } from '@useCases/errors/userAlreadyExistsError';
import { compare } from 'bcryptjs';
import { describe, expect, it, beforeEach } from 'vitest';
import { RegisterUseCase } from '.';

let usersRepository: UsersRepository;
let sut: RegisterUseCase;

describe('Register use case', () => {
	beforeEach(() => {
		usersRepository = new InMemoryUsersRepository();
		sut = new RegisterUseCase(usersRepository);
	});

	it('should be able to create a new user', async () => {
		const { user } = await sut.execute({
			email: 'johndoe@example.com',
			name: 'John Doe',
			password: '123456',
		});

		expect(user).toBeTruthy();
	});

	it('should hash user password upon registration', async () => {
		const { user } = await sut.execute({
			email: 'johndoe@example.com',
			name: 'John Doe',
			password: '123456',
		});

		const isPasswordCorrectlyHashed = await compare(
			'123456',
			user.password_hash,
		);

		expect(isPasswordCorrectlyHashed).toBe(true);
	});

	it('should not be able to register with same email twice', async () => {
		const email = 'johndoe@example.com';

		await sut.execute({
			email,
			name: 'John Doe',
			password: '123456',
		});

		expect(async () => {
			await sut.execute({
				email,
				name: 'John Doe',
				password: '123456',
			});
		}).rejects.toBeInstanceOf(UserAlreadyExistsError);
	});
});
