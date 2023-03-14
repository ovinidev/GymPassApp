import { CheckIn } from '@prisma/client';
import { CheckInsRepository } from '@repositories/contracts/checkInsRepository';

interface FetchCheckInHistoryRequest {
	userId: string;
	page: number;
	pageLength: number;
}

interface FetchCheckInHistoryResponse {
	checkIns: CheckIn[];
}

export class FetchCheckInHistory {
	constructor(private checkInsRepository: CheckInsRepository) {}

	async execute({
		userId,
		page,
		pageLength,
	}: FetchCheckInHistoryRequest): Promise<FetchCheckInHistoryResponse> {
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
