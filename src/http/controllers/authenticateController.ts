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
		const body = request.body;

		const authenticateUserBodySchema = z.object({
			email: z
				.string({ required_error: 'email is required' })
				.email({ message: 'field must be of type email' }),
			password: z
				.string({ required_error: 'password is required' })
				.min(6, { message: 'password must have 6 characters' }),
		});

		const { email, password } = authenticateUserBodySchema.parse(body);

		const authenticateUseCase = makeAuthenticateUseCase();

		const { user } = await authenticateUseCase.execute({ email, password });

		const token = await reply.jwtSign(
			{},
			{
				sign: {
					sub: user.id,
					expiresIn: '1d',
				},
			},
		);

		return reply.status(200).send({ token });
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
