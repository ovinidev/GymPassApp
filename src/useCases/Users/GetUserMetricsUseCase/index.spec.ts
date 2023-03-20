import { describe, it, expect, beforeEach } from 'vitest';
import { CheckInsRepository } from '@repositories/contracts/checkInsRepository';
import { inMemoryCheckInsRepository } from '@repositories/inMemory/inMemoryCheckInsRepository';
import { randomUUID } from 'node:crypto';
import { GetUserMetricsUseCase } from '.';

let checkInsRepository: CheckInsRepository;
let sut: GetUserMetricsUseCase;

describe('Get User Metrics use case', () => {
	beforeEach(() => {
		checkInsRepository = new inMemoryCheckInsRepository();
		sut = new GetUserMetricsUseCase(checkInsRepository);
	});

	it('should be able to fetch check ins count from metrics', async () => {
		const gym_id = randomUUID();
		const user_id = randomUUID();

		await checkInsRepository.create({
			gym_id,
			user_id,
		});

		await checkInsRepository.create({
			gym_id,
			user_id,
		});

		await checkInsRepository.create({
			gym_id,
			user_id,
		});

		const { checkInsCount } = await sut.execute({
			userId: user_id,
		});

		expect(checkInsCount).toEqual(3);
	});
});
