import { FastifyInstance } from 'fastify';
import { authenticateController } from '@http/controllers/Users/authenticateController';
import { getUserMetricsController } from '@http/controllers/Users/getUserMetricsController';
import { getUserProfileController } from '@http/controllers/Users/getUserProfileController';
import { registerController } from '@http/controllers/Users/registerController';
import { verifyJWT } from '../../middlewares/verifyJWT';
import { refreshTokenController } from './refreshTokenController';

export async function usersRoutes(app: FastifyInstance) {
	app.post('/users', registerController);
	app.get('/users', { onRequest: [verifyJWT] }, getUserMetricsController);

	app.post('/sessions', authenticateController);
	app.post('/refreshToken', refreshTokenController);

	app.get('/me', { onRequest: [verifyJWT] }, getUserProfileController);
}
