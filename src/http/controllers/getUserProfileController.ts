import { FastifyReply } from 'fastify';
import { FastifyRequest } from 'fastify';
import { makeGetUserProfileUseCase } from '@useCases/factories/makeGetUserProfileUseCase';
import { UserNotFoundError } from '@useCases/errors/userNotFoundError';

export async function getUserProfileController(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	try {
		const userId = request.user.sub;

		const getUserProfileUseCase = makeGetUserProfileUseCase();

		const { user } = await getUserProfileUseCase.execute({ userId });

		return reply.status(200).send({
			name: user.name,
			email: user.email,
		});
	} catch (err) {
		if (err instanceof UserNotFoundError) {
			return reply.status(409).send({ message: err.message });
		}

		throw err;
	}
}
