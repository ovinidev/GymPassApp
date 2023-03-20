import { InMemoryUsersRepository } from '@repositories/inMemory/inMemoryUsersRepository';
import { UsersRepository } from '@repositories/contracts/usersRepository';
import { UserNotFoundError } from '@useCases/errors/userNotFoundError';
import { hash } from 'bcryptjs';
import { randomUUID } from 'node:crypto';
import { describe, expect, it, beforeEach } from 'vitest';
import { GetUserProfileUseCase } from '.';

let usersRepository: UsersRepository;
let sut: GetUserProfileUseCase;

describe('Register use case', () => {
	beforeEach(() => {
		usersRepository = new InMemoryUsersRepository();
		sut = new GetUserProfileUseCase(usersRepository);
	});

	it('should be able to get user profile', async () => {
		const userId = randomUUID();

		await usersRepository.create({
			id: userId,
			email: 'johndoe@example.com',
			name: 'John Doe',
			password_hash: await hash('123456', 6),
		});

		const { user } = await sut.execute({ userId });

		expect(user).toBeTruthy();
	});

	it('should not be able to register with same email twice', async () => {
		expect(async () => {
			await sut.execute({ userId: 'invalid id' });
		}).rejects.toBeInstanceOf(UserNotFoundError);
	});
});
