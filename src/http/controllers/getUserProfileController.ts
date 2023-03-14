/* eslint-disable @typescript-eslint/ban-ts-comment */
import { FastifyReply } from 'fastify';
import { FastifyRequest } from 'fastify';
import { makeGetUserProfileUseCase } from '@useCases/factories/makeGetUserProfileUseCase';
import { UserNotFoundError } from '@useCases/errors/userNotFoundError';

export async function getUserProfileController(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	try {
		// @ts-ignore
		const { userId } = request.params;

		const getUserProfileUseCase = makeGetUserProfileUseCase();

		const user = await getUserProfileUseCase.execute({ userId });

		return reply.status(201).send(user);
	} catch (err) {
		if (err instanceof UserNotFoundError) {
			return reply.status(409).send({ message: err.message });
		}

		throw err;
	}
}
