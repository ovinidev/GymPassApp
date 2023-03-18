import { FastifyReply } from 'fastify';
import { FastifyRequest } from 'fastify';
import { z, ZodError } from 'zod';
import { zodErrorsFormatted } from '../../utils/zodErrorsFormatted';
import { makeValidateCheckInUseCase } from '@useCases/factories/makeValidateCheckInUseCase';
import { CheckInValidationTimeLimitError } from '@useCases/errors/checkInValidationTimeLimitError';
import { checkInNotFoundError } from '@useCases/errors/checkInNotFoundError';

export async function validateCheckInController(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	try {
		const params = request.params;

		const validateCheckInParamsSchema = z.object({
			checkInId: z.string({ required_error: 'check in id is required' }),
		});

		const { checkInId } = validateCheckInParamsSchema.parse(params);

		const validateCheckInUseCase = makeValidateCheckInUseCase();

		const { checkIn } = await validateCheckInUseCase.execute({
			checkInId,
		});

		return reply.status(201).send(checkIn);
	} catch (err) {
		if (err instanceof ZodError) {
			const errors = zodErrorsFormatted({
				err,
			});

			return reply.status(400).send(errors);
		}

		if (err instanceof CheckInValidationTimeLimitError) {
			return reply.status(409).send({ message: err.message });
		}

		if (err instanceof checkInNotFoundError) {
			return reply.status(409).send({ message: err.message });
		}

		throw err;
	}
}
