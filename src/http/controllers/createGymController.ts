import { FastifyReply } from 'fastify';
import { FastifyRequest } from 'fastify';
import { z, ZodError } from 'zod';
import { zodErrorsFormatted } from './errors/zodErrorsFormatted';
import { makeCreateGymUseCase } from '@useCases/factories/makeCreateGymUseCase';

export async function createGymController(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	try {
		const registerUserBodySchema = z.object({
			name: z.string({ required_error: 'name is required' }),
			description: z.string().nullable().optional(),
			latitude: z.number({ required_error: 'latitude is required' }),
			longitude: z.number({ required_error: 'longitude is required' }),
			phone: z.string().nullable().optional(),
		});

		const { latitude, longitude, name, description, phone } =
			registerUserBodySchema.parse(request.body);

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
			zodErrorsFormatted({
				err,
				reply,
			});
		}

		throw err;
	}
}
