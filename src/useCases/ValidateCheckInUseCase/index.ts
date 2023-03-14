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

		const checkInValidationLimitInMinutes = 20;

		const checkInCreatedAt = dayjs(checkIn.created_at);
		const currentDate = dayjs(new Date());

		const diffInMinutes = currentDate.diff(checkInCreatedAt, 'minutes');

		if (diffInMinutes > checkInValidationLimitInMinutes) {
			throw new CheckInValidationTimeLimitError();
		}

		checkIn.validated_at = new Date();

		await this.checkInsRepository.save(checkIn);

		return {
			checkIn,
		};
	}
}
