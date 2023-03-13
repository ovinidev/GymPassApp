import { InMemoryUsersRepository } from '@repositories/inMemory/inMemoryUsersRepository';
import { UsersRepository } from '@repositories/contracts/usersRepository';
import { InvalidCredentialError } from '@useCases/errors/invalidCredentialError';
import { hash } from 'bcryptjs';
import { describe, it, expect, beforeEach } from 'vitest';
import { AuthenticateUseCase } from '.';

let usersRepository: UsersRepository;
let sut: AuthenticateUseCase;

describe('Authenticate use case', () => {
	beforeEach(() => {
		usersRepository = new InMemoryUsersRepository();
		sut = new AuthenticateUseCase(usersRepository);
	});

	it('should be able to authenticate', async () => {
		const userToBeCreate = {
			name: 'John Doe',
			email: 'johndoe@example.com',
			password_hash: await hash('123456', 6),
		};

		await usersRepository.create(userToBeCreate);

		const user = await sut.execute({
			email: 'johndoe@example.com',
			password: '123456',
		});

		expect(user).toHaveProperty('user');
	});

	it('should not be able to authenticate with email invalid', async () => {
		expect(async () => {
			await sut.execute({
				email: 'invalid@mail.com',
				password: '123456',
			});
		}).rejects.toBeInstanceOf(InvalidCredentialError);
	});

	it('should not be able to authenticate with password invalid', async () => {
		const userToBeCreate = {
			name: 'John Doe',
			email: 'johndoe@example.com',
			password_hash: await hash('123456', 6),
		};

		await usersRepository.create(userToBeCreate);

		expect(async () => {
			await sut.execute({
				email: 'johndoe@example.com',
				password: 'invalid',
			});
		}).rejects.toBeInstanceOf(InvalidCredentialError);
	});
});
