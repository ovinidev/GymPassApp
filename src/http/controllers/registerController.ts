import { FastifyReply } from 'fastify';
import { FastifyRequest } from 'fastify';
import { z, ZodError } from 'zod';
import { RegisterUseCase } from '@useCases/registerUseCase';
import { PrismaUsersRepository } from '@repositories/prisma/prismaUsersRepository';
import { UserAlreadyExistsError } from '@useCases/errors/userAlreadyExistsError';
import { zodErrorsFormatted } from './errors/zodErrorsFormatted';

export async function registerController(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	try {
		const registerUserBodySchema = z.object({
			name: z.string({ required_error: 'name is required' }),
			email: z
				.string({ required_error: 'email is required' })
				.email({ message: 'field must be of type email' }),
			password: z
				.string({ required_error: 'password is required' })
				.min(6, { message: 'password must have 6 characters' }),
		});

		const { email, name, password } = registerUserBodySchema.parse(
			request.body,
		);

		const prismaUsersRepository = new PrismaUsersRepository();

		const registerUseCase = new RegisterUseCase(prismaUsersRepository);

		await registerUseCase.execute({ email, name, password });

		return reply.status(201).send({ message: 'User has been created' });
	} catch (err) {
		if (err instanceof UserAlreadyExistsError) {
			return reply.status(409).send({ message: err.message });
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
