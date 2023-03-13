import { FastifyReply } from 'fastify';
import { FastifyRequest } from 'fastify';
import { z, ZodError } from 'zod';
import { zodErrorsFormatted } from './errors/zodErrorsFormatted';
import { InvalidCredentialError } from '@useCases/errors/invalidCredentialError';
import { makeAuthenticateUseCase } from '@useCases/factories/makeAuthenticateUseCase';

export async function authenticateController(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	try {
		const authenticateUserBodySchema = z.object({
			email: z
				.string({ required_error: 'email is required' })
				.email({ message: 'field must be of type email' }),
			password: z
				.string({ required_error: 'password is required' })
				.min(6, { message: 'password must have 6 characters' }),
		});

		const { email, password } = authenticateUserBodySchema.parse(request.body);

		const authenticateUseCase = makeAuthenticateUseCase();

		const { user } = await authenticateUseCase.execute({ email, password });

		return reply.status(201).send({
			id: user.id,
			name: user.name,
			email: user.email,
		});
	} catch (err) {
		if (err instanceof InvalidCredentialError) {
			return reply.status(400).send({ message: err.message });
		}

		if (err instanceof ZodError) {
			zodErrorsFormatted({
				err,
				reply,
			});
		}

		throw err;
	}
}
