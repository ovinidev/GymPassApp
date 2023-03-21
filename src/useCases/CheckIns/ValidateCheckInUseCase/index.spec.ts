import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { ValidateCheckInUseCase } from '.';
import { CheckInsRepository } from '@repositories/contracts/checkInsRepository';
import { inMemoryCheckInsRepository } from '@repositories/inMemory/inMemoryCheckInsRepository';
import { randomUUID } from 'node:crypto';
import { checkInNotFoundError } from '@useCases/errors/checkInNotFoundError';
import { CheckInValidationTimeLimitError } from '@useCases/errors/checkInValidationTimeLimitError';

let checkInsRepository: CheckInsRepository;
let sut: ValidateCheckInUseCase;

describe('Validate check in use case', () => {
	beforeEach(() => {
		checkInsRepository = new inMemoryCheckInsRepository();
		sut = new ValidateCheckInUseCase(checkInsRepository);

		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('should be able to validate check in', async () => {
		const gym_id = randomUUID();
		const user_id = randomUUID();
		const checkIn_id = randomUUID();

		vi.setSystemTime(new Date(2023, 2, 14, 10, 15, 0)); // 13:15:00

		await checkInsRepository.create({
			id: checkIn_id,
			gym_id,
			user_id,
			created_at: '2023-03-14T13:00:00.000Z',
		});

		const { checkIn } = await sut.execute({
			checkInId: checkIn_id,
		});

		expect(checkIn.validated_at).toEqual(expect.any(Date));
		expect(checkIn.validated_at).toBeTruthy();
	});

	it('should not be able to validate check in when gym inexistent', async () => {
		expect(async () => {
			await sut.execute({
				checkInId: 'inexistent check in',
			});
		}).rejects.toBeInstanceOf(checkInNotFoundError);
	});

	it.skip('should not be able to validate check-in after 20 minutes', async () => {
		const gym_id = randomUUID();
		const user_id = randomUUID();
		const checkIn_id = randomUUID();

		vi.setSystemTime(new Date(2023, 2, 14, 10, 25, 0)); // 13:25:00

		await checkInsRepository.create({
			id: checkIn_id,
			gym_id,
			user_id,
			created_at: '2023-03-14T13:00:00.000Z',
		});

		expect(async () => {
			await sut.execute({
				checkInId: checkIn_id,
			});
		}).rejects.toBeInstanceOf(CheckInValidationTimeLimitError);
	});
});
