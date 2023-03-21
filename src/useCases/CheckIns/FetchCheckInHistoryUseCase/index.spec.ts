import { describe, it, expect, beforeEach } from 'vitest';
import { FetchCheckInHistoryUseCase } from '.';
import { CheckInsRepository } from '@repositories/contracts/checkInsRepository';
import { inMemoryCheckInsRepository } from '@repositories/inMemory/inMemoryCheckInsRepository';
import { randomUUID } from 'node:crypto';

let checkInsRepository: CheckInsRepository;
let sut: FetchCheckInHistoryUseCase;

describe('Fetch check in history use case', () => {
	beforeEach(() => {
		checkInsRepository = new inMemoryCheckInsRepository();
		sut = new FetchCheckInHistoryUseCase(checkInsRepository);
	});

	it('should be able to fetch check in history', async () => {
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

		const { checkIns } = await sut.execute({
			userId: user_id,
			page: 1,
			pageLength: 22,
		});

		expect(checkIns).toHaveLength(3);
		expect(checkIns).toEqual([
			expect.objectContaining({ gym_id }),
			expect.objectContaining({ gym_id }),
			expect.objectContaining({ gym_id }),
		]);
	});

	it('should be able to fetch check in history paginated', async () => {
		const gym_id = randomUUID();
		const user_id = randomUUID();
		const PAGE_LENGTH = 22;

		for (let i = 1; i <= PAGE_LENGTH; i++) {
			await checkInsRepository.create({
				gym_id,
				user_id,
			});
		}

		const { checkIns } = await sut.execute({
			userId: user_id,
			page: 1,
			pageLength: PAGE_LENGTH,
		});

		expect(checkIns).toHaveLength(PAGE_LENGTH);
	});
});
