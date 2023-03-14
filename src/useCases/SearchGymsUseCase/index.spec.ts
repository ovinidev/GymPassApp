import { describe, it, expect, beforeEach } from 'vitest';
import { GymsRepository } from '@repositories/contracts/gymsRepository';
import { InMemoryGymsRepository } from '@repositories/inMemory/inMemoryGymsRepository';
import { SearchGymsUseCase } from '.';
import { GymNotFoundError } from '@useCases/errors/gymNotFoundError';

let gymsRepository: GymsRepository;
let sut: SearchGymsUseCase;

describe('Search gym use case', () => {
	beforeEach(() => {
		gymsRepository = new InMemoryGymsRepository();
		sut = new SearchGymsUseCase(gymsRepository);
	});

	it('should be able to search gym', async () => {
		await gymsRepository.create({
			name: 'gym test',
			description: 'description test',
			latitude: 0,
			longitude: 0,
			phone: '83999312',
		});

		await gymsRepository.create({
			name: 'gym test',
			description: 'description test',
			latitude: 0,
			longitude: 0,
			phone: '83999312',
		});

		const { gyms } = await sut.execute({
			name: 'gym test',
			page: 1,
			pageLength: 5,
		});

		expect(gyms).toHaveLength(2);
	});

	it('should be able to search gyms by name paginated', async () => {
		const PAGE_LENGTH = 22;

		for (let i = 1; i <= PAGE_LENGTH; i++) {
			await gymsRepository.create({
				name: 'gym test',
				description: 'description test',
				latitude: 0,
				longitude: 0,
				phone: '83999312',
			});
		}

		const { gyms } = await sut.execute({
			name: 'gym test',
			page: 1,
			pageLength: PAGE_LENGTH,
		});

		expect(gyms).toHaveLength(PAGE_LENGTH);
	});

	it('should not be able to search gym nonexistent', async () => {
		expect(async () => {
			await sut.execute({
				name: 'gym test',
				page: 1,
				pageLength: 5,
			});
		}).rejects.toBeInstanceOf(GymNotFoundError);
	});
});
