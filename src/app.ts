import fastifyJwt from '@fastify/jwt';
import { routes } from '@http/controllers/routes';
import fastify from 'fastify';
import { env } from './env';
import fastifyCookie from '@fastify/cookie';

export const app = fastify();

app.register(fastifyJwt, {
	secret: env.JWT_SECRET,
	cookie: {
		cookieName: 'refreshToken',
		signed: false,
	},
});

app.register(fastifyCookie);

app.register(routes);
