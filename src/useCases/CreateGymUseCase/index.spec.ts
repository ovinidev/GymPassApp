import { describe, it, expect, beforeEach } from 'vitest';
import { CreateGymUseCase } from '.';
import { GymsRepository } from '@repositories/contracts/gymsRepository';
import { InMemoryGymsRepository } from '@repositories/inMemory/inMemoryGymsRepository';

let gymsRepository: GymsRepository;
let sut: CreateGymUseCase;

describe('Create gym use case', () => {
	beforeEach(() => {
		gymsRepository = new InMemoryGymsRepository();
		sut = new CreateGymUseCase(gymsRepository);
	});

	it('should be able to create gym', async () => {
		const { gym } = await sut.execute({
			name: 'gym test',
			description: 'description test',
			latitude: 0,
			longitude: 0,
			phone: '83999312',
		});

		expect(gym).toBeTruthy();
	});
});
