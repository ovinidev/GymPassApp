import { InMemoryUsersRepository } from '@repositories/inMemory/inMemoryUsersRepository';
import { UsersRepository } from '@repositories/contracts/usersRepository';
import { hash } from 'bcryptjs';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { CheckInUseCase } from '.';
import { CheckInsRepository } from '@repositories/contracts/checkInsRepository';
import { inMemoryCheckInsRepository } from '@repositories/inMemory/inMemoryCheckInsRepository';
import { randomUUID } from 'node:crypto';

let checkInsRepository: CheckInsRepository;
let usersRepository: UsersRepository;
let sut: CheckInUseCase;

describe('Check in use case', () => {
	beforeEach(() => {
		checkInsRepository = new inMemoryCheckInsRepository();
		usersRepository = new InMemoryUsersRepository();
		sut = new CheckInUseCase(checkInsRepository);

		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('should be able to check in', async () => {
		vi.setSystemTime(new Date(2023, 2, 11, 8, 0, 0));
		const userId = randomUUID();

		const user = await usersRepository.create({
			id: userId,
			email: 'johndoe@example.com',
			name: 'John Doe',
			password_hash: await hash('123456', 6),
		});

		const { checkIn } = await sut.execute({
			gymId: randomUUID(),
			userId: user.id,
		});

		expect(checkIn).toBeTruthy();
	});

	it('should not be able to check in twice in the same day', async () => {
		const userId = randomUUID();
		const gymId = randomUUID();

		const user = await usersRepository.create({
			id: userId,
			email: 'johndoe@example.com',
			name: 'John Doe',
			password_hash: await hash('123456', 6),
		});

		vi.setSystemTime(new Date(2022, 0, 22, 8, 0, 0));

		await sut.execute({
			gymId: gymId,
			userId: user.id,
		});

		expect(async () => {
			await sut.execute({
				gymId: gymId,
				userId: user.id,
			});
		}).rejects.toBeInstanceOf(Error);
	});

	it('should not be able to check in twice in different days', async () => {
		const userId = randomUUID();
		const gymId = randomUUID();

		const user = await usersRepository.create({
			id: userId,
			email: 'johndoe@example.com',
			name: 'John Doe',
			password_hash: await hash('123456', 6),
		});

		vi.setSystemTime(new Date(2022, 0, 22, 8, 0, 0));

		await sut.execute({
			gymId: gymId,
			userId: user.id,
		});

		vi.setSystemTime(new Date(2022, 0, 23, 8, 0, 0));

		const { checkIn } = await sut.execute({
			gymId: gymId,
			userId: user.id,
		});

		expect(checkIn).toBeTruthy();
	});
});
