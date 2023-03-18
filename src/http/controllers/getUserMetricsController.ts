import { FastifyReply } from 'fastify';
import { FastifyRequest } from 'fastify';
import { makeGetUserMetricsUseCase } from '@useCases/factories/makeGetUserMetricsUseCase';

export async function getUserMetricsController(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	try {
		const userId = request.user.sub;

		const getUserMetricsUseCase = makeGetUserMetricsUseCase();

		const checkInsCount = await getUserMetricsUseCase.execute({ userId });

		return reply.status(200).send(checkInsCount);
	} catch (err) {
		return reply.status(409).send({ message: err });
	}
}
