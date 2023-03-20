import { FastifyReply } from 'fastify';
import { FastifyRequest } from 'fastify';
import { z, ZodError } from 'zod';
import { zodErrorsFormatted } from '@utils/zodErrorsFormatted';
import { makeFetchCheckInHistoryUseCase } from '@useCases/factories/makeFetchCheckInHistoryUseCase';

export async function fetchCheckInHistoryController(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	try {
		const userId = request.user.sub;
		const query = request.query;

		const fetchCheckInQuerySchema = z.object({
			page: z.coerce.number({ required_error: 'page is required' }),
			pageLength: z.coerce.number({ required_error: 'pageLength is required' }),
		});

		const { page, pageLength } = fetchCheckInQuerySchema.parse(query);

		const checkInUseCase = makeFetchCheckInHistoryUseCase();

		const { checkIns } = await checkInUseCase.execute({
			userId,
			page,
			pageLength,
		});

		return reply.status(201).send(checkIns);
	} catch (err) {
		if (err instanceof ZodError) {
			const errors = zodErrorsFormatted({
				err,
			});

			return reply.status(400).send(errors);
		}

		throw err;
	}
}
