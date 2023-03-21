import { FastifyReply } from 'fastify';
import { FastifyRequest } from 'fastify';
import { InvalidCredentialError } from '@useCases/errors/invalidCredentialError';

export async function refreshTokenController(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	try {
		await request.jwtVerify({ onlyCookie: true });

		const { role, sub: userId } = request.user;

		const token = await reply.jwtSign(
			{ role },
			{
				sign: {
					sub: userId,
					expiresIn: '1d',
				},
			},
		);

		const refreshToken = await reply.jwtSign(
			{ role },
			{
				sign: {
					sub: userId,
					expiresIn: '7d',
				},
			},
		);

		return reply
			.setCookie('refreshToken', refreshToken, {
				path: '/',
				secure: true,
				sameSite: true,
				httpOnly: true,
			})
			.status(200)
			.send({ token });
	} catch (err) {
		if (err instanceof InvalidCredentialError) {
			return reply.status(400).send({ message: err.message });
		}

		throw err;
	}
}
