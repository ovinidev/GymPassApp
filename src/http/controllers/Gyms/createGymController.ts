import { FastifyReply } from 'fastify';
import { FastifyRequest } from 'fastify';
import { z, ZodError } from 'zod';
import { zodErrorsFormatted } from '@utils/zodErrorsFormatted';
import { makeCreateGymUseCase } from '@useCases/factories/makeCreateGymUseCase';

export async function createGymController(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	try {
		const body = request.body;

		const createGymBodySchema = z.object({
			name: z.string({ required_error: 'name is required' }),
			description: z.string().nullable().optional(),
			latitude: z.number({ required_error: 'latitude is required' }),
			longitude: z.number({ required_error: 'longitude is required' }),
			phone: z.string().nullable().optional(),
		});

		const { latitude, longitude, name, description, phone } =
			createGymBodySchema.parse(body);

		const createGymUseCase = makeCreateGymUseCase();

		const { gym } = await createGymUseCase.execute({
			description,
			latitude,
			longitude,
			name,
			phone,
		});

		return reply.status(201).send(gym);
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
