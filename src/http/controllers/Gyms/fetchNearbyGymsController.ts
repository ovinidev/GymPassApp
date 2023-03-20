import { FastifyReply } from 'fastify';
import { FastifyRequest } from 'fastify';
import { z, ZodError } from 'zod';
import { zodErrorsFormatted } from '@utils/zodErrorsFormatted';
import { makeFetchNearbyGymsUseCase } from '@useCases/factories/makeFetchNearbyGymsUseCase';
import { GymNotFoundError } from '@useCases/errors/gymNotFoundError';

export async function fetchNearbyGymsController(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	try {
		const query = request.query;

		const fetchNearbyBodySchema = z.object({
			userLatitude: z.coerce.number({
				required_error: 'userLatitude is required',
			}),
			userLongitude: z.coerce.number({
				required_error: 'userLongitude is required',
			}),
		});

		const { userLatitude, userLongitude } = fetchNearbyBodySchema.parse(query);

		const fetchNearbyGymsUseCase = makeFetchNearbyGymsUseCase();

		const { gyms } = await fetchNearbyGymsUseCase.execute({
			userLatitude,
			userLongitude,
		});

		return reply.status(200).send(gyms);
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
