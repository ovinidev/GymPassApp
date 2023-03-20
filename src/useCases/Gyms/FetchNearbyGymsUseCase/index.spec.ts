import { describe, it, expect, beforeEach } from 'vitest';
import { GymsRepository } from '@repositories/contracts/gymsRepository';
import { InMemoryGymsRepository } from '@repositories/inMemory/inMemoryGymsRepository';
import { FetchNearbyGymsUseCase } from '.';

let gymsRepository: GymsRepository;
let sut: FetchNearbyGymsUseCase;

describe('Search gym use case', () => {
	beforeEach(() => {
		gymsRepository = new InMemoryGymsRepository();
		sut = new FetchNearbyGymsUseCase(gymsRepository);
	});

	it('should be able to search gym', async () => {
		await gymsRepository.create({
			name: 'typescript gym',
			description: 'description test',
			latitude: -6.8574758,
			longitude: -35.4886997,
			phone: '83999312',
		});

		await gymsRepository.create({
			name: 'javascript gym',
			description: 'description test',
			latitude: -9.8574758,
			longitude: -20.4886997,
			phone: '83999312',
		});

		const { gyms } = await sut.execute({
			userLatitude: -6.859689,
			userLongitude: -35.4895304,
		});

		expect(gyms).toHaveLength(1);
	});
});
