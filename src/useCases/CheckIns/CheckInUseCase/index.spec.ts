import { InMemoryUsersRepository } from '@repositories/inMemory/inMemoryUsersRepository';
import { UsersRepository } from '@repositories/contracts/usersRepository';
import { hash } from 'bcryptjs';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { CheckInUseCase } from '.';
import { CheckInsRepository } from '@repositories/contracts/checkInsRepository';
import { inMemoryCheckInsRepository } from '@repositories/inMemory/inMemoryCheckInsRepository';
import { GymsRepository } from '@repositories/contracts/gymsRepository';
import { InMemoryGymsRepository } from '@repositories/inMemory/inMemoryGymsRepository';
import { GymNotFoundError } from '@useCases/errors/gymNotFoundError';
import { MaxDistanceError } from '@useCases/errors/maxDistanceError';
import { CheckInSameDayError } from '@useCases/errors/checkInSameDayError';

let checkInsRepository: CheckInsRepository;
let usersRepository: UsersRepository;
let gymsRepository: GymsRepository;
let sut: CheckInUseCase;

describe('Check in use case', () => {
	beforeEach(() => {
		checkInsRepository = new inMemoryCheckInsRepository();
		usersRepository = new InMemoryUsersRepository();
		gymsRepository = new InMemoryGymsRepository();
		sut = new CheckInUseCase(checkInsRepository, gymsRepository);

		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('should be able to check in', async () => {
		vi.setSystemTime(new Date(2023, 2, 11, 8, 0, 0));

		const user = await usersRepository.create({
			email: 'johndoe@example.com',
			name: 'John Doe',
			password_hash: await hash('123456', 6),
		});

		const gym = await gymsRepository.create({
			name: 'gym test',
			latitude: 0,
			longitude: 0,
		});

		const { checkIn } = await sut.execute({
			gymId: gym.id,
			userId: user.id,
			userLatitude: 0,
			userLongitude: 0,
		});

		expect(checkIn).toBeTruthy();
	});

	it('should not be able to check in twice in the same day', async () => {
		vi.setSystemTime(new Date(2022, 0, 22, 8, 0, 0));

		const user = await usersRepository.create({
			email: 'johndoe@example.com',
			name: 'John Doe',
			password_hash: await hash('123456', 6),
		});

		const gym = await gymsRepository.create({
			name: 'gym test',
			latitude: 0,
			longitude: 0,
		});

		await sut.execute({
			gymId: gym.id,
			userId: user.id,
			userLatitude: 0,
			userLongitude: 0,
		});

		expect(async () => {
			await sut.execute({
				gymId: gym.id,
				userId: user.id,
				userLatitude: 0,
				userLongitude: 0,
			});
		}).rejects.toBeInstanceOf(CheckInSameDayError);
	});

	it('should be able to check in twice in different days', async () => {
		vi.setSystemTime(new Date(2022, 0, 22, 8, 0, 0));

		const user = await usersRepository.create({
			email: 'johndoe@example.com',
			name: 'John Doe',
			password_hash: await hash('123456', 6),
		});

		const gym = await gymsRepository.create({
			name: 'gym test',
			latitude: 0,
			longitude: 0,
		});

		await sut.execute({
			gymId: gym.id,
			userId: user.id,
			userLatitude: 0,
			userLongitude: 0,
		});

		vi.setSystemTime(new Date(2022, 0, 23, 8, 0, 0));

		const checkIn = await sut.execute({
			gymId: gym.id,
			userId: user.id,
			userLatitude: 0,
			userLongitude: 0,
		});

		expect(checkIn).toBeTruthy();
	});

	it('should not be able to check in on invalid gym distance', async () => {
		vi.setSystemTime(new Date(2023, 2, 11, 8, 0, 0));

		const user = await usersRepository.create({
			email: 'johndoe@example.com',
			name: 'John Doe',
			password_hash: await hash('123456', 6),
		});

		const gym = await gymsRepository.create({
			name: 'gym test',
			latitude: -6.8649189,
			longitude: -35.4918943,
		});

		expect(async () => {
			await sut.execute({
				gymId: gym.id,
				userId: user.id,
				userLatitude: -7.8474433,
				userLongitude: -34.3029349,
			});
		}).rejects.toBeInstanceOf(MaxDistanceError);
	});

	it('should not be able to check in on not found gym', async () => {
		vi.setSystemTime(new Date(2023, 2, 11, 8, 0, 0));

		const user = await usersRepository.create({
			email: 'johndoe@example.com',
			name: 'John Doe',
			password_hash: await hash('123456', 6),
		});

		expect(async () => {
			await sut.execute({
				gymId: 'invalid gym',
				userId: user.id,
				userLatitude: -7.8474433,
				userLongitude: -34.3029349,
			});
		}).rejects.toBeInstanceOf(GymNotFoundError);
	});
});
