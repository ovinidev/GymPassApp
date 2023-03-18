import { FastifyReply } from 'fastify';
import { FastifyRequest } from 'fastify';
import { z, ZodError } from 'zod';
import { zodErrorsFormatted } from '../../utils/zodErrorsFormatted';
import { makeCheckInUseCase } from '@useCases/factories/makeCheckInUseCase';
import { GymNotFoundError } from '@useCases/errors/gymNotFoundError';
import { MaxDistanceError } from '@useCases/errors/maxDistanceError';
import { CheckInSameDayError } from '@useCases/errors/checkInSameDayError';

export async function checkInController(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	try {
		const userId = request.user.sub;
		const body = request.body;

		const checkInBodySchema = z.object({
			gymId: z.string({ required_error: 'name is required' }),
			userLatitude: z.number({ required_error: 'userLatitude is required' }),
			userLongitude: z.number({ required_error: 'userLongitude is required' }),
		});

		const { gymId, userLatitude, userLongitude } =
			checkInBodySchema.parse(body);

		const checkInUseCase = makeCheckInUseCase();

		const { checkIn } = await checkInUseCase.execute({
			gymId,
			userId,
			userLatitude,
			userLongitude,
		});

		return reply.status(201).send(checkIn);
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

		if (err instanceof MaxDistanceError) {
			return reply.status(409).send({ message: err.message });
		}

		if (err instanceof CheckInSameDayError) {
			return reply.status(409).send({ message: err.message });
		}

		throw err;
	}
}
