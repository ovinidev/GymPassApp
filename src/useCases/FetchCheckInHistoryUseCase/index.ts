import { CheckIn } from '@prisma/client';
import { CheckInsRepository } from '@repositories/contracts/checkInsRepository';

interface FetchCheckInHistoryUseCaseRequest {
	userId: string;
	page: number;
	pageLength: number;
}

interface FetchCheckInHistoryUseCaseResponse {
	checkIns: CheckIn[];
}

export class FetchCheckInHistoryUseCase {
	constructor(private checkInsRepository: CheckInsRepository) {}

	async execute({
		userId,
		page,
		pageLength,
	}: FetchCheckInHistoryUseCaseRequest): Promise<FetchCheckInHistoryUseCaseResponse> {
		const checkIns = await this.checkInsRepository.findManyByUserId(
			userId,
			page,
			pageLength,
		);

		return {
			checkIns,
		};
	}
}
