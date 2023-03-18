import { CheckIn } from '@prisma/client';
import { CheckInsRepository } from '@repositories/contracts/checkInsRepository';
import { checkInNotFoundError } from '@useCases/errors/checkInNotFoundError';
import { CheckInValidationTimeLimitError } from '@useCases/errors/checkInValidationTimeLimitError';
import dayjs from 'dayjs';

interface ValidateCheckInUseCaseRequest {
	checkInId: string;
}

interface ValidateCheckInUseCaseResponse {
	checkIn: CheckIn;
}

export class ValidateCheckInUseCase {
	constructor(private checkInsRepository: CheckInsRepository) {}

	async execute({
		checkInId,
	}: ValidateCheckInUseCaseRequest): Promise<ValidateCheckInUseCaseResponse> {
		const checkIn = await this.checkInsRepository.findById(checkInId);

		if (!checkIn) throw new checkInNotFoundError();

		const checkInCreatedAt = dayjs(checkIn.created_at);
		const currentDate = dayjs(new Date());

		const diffInMinutes = currentDate.diff(checkInCreatedAt, 'minutes');

		const CHECK_IN_VALIDATION_IN_MINUTES = 20;

		if (diffInMinutes > CHECK_IN_VALIDATION_IN_MINUTES) {
			throw new CheckInValidationTimeLimitError();
		}

		checkIn.validated_at = new Date();

		await this.checkInsRepository.save(checkIn);

		return {
			checkIn,
		};
	}
}
