import { FastifyReply, FastifyRequest } from 'fastify';

export async function verifyIsAdmin(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const { role } = request.user;

	if (role !== 'ADMIN') {
		return reply.status(401).send({ message: 'User to be admin' });
	}
}
