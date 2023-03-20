import { FastifyReply } from 'fastify';
import { FastifyRequest } from 'fastify';
import { z, ZodError } from 'zod';
import { zodErrorsFormatted } from '@utils/zodErrorsFormatted';
import { makeSearchGymsUseCase } from '@useCases/factories/makeSearchGymsUseCase';
import { GymNotFoundError } from '@useCases/errors/gymNotFoundError';

export async function searchGymsController(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	try {
		const query = request.query;
		const params = request.params;

		const searchGymsQuerySchema = z.object({
			page: z.coerce.number({ required_error: 'page is required' }),
			pageLength: z.coerce.number({ required_error: 'pageLength is required' }),
		});

		const searchGymsParamsSchema = z.object({
			name: z.string({ required_error: 'gym name is required' }),
		});

		const { page, pageLength } = searchGymsQuerySchema.parse(query);
		const { name } = searchGymsParamsSchema.parse(params);

		const searchGymsUseCase = makeSearchGymsUseCase();

		const gyms = await searchGymsUseCase.execute({
			name,
			page,
			pageLength,
		});

		return reply.status(201).send(gyms);
	} catch (err) {
		if (err instanceof ZodError) {
			const errors = zodErrorsFormatted({
				err,
			});

			return reply.status(400).send(errors);
		}

		if (err instanceof GymNotFoundError) {
			return reply.status(409).send({ message: err.message });
		}

		throw err;
	}
}
