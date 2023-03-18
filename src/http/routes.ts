import { FastifyInstance } from 'fastify';
import { authenticateController } from './controllers/authenticateController';
import { createGymController } from './controllers/createGymController';
import { getUserProfileController } from './controllers/getUserProfileController';
import { registerController } from './controllers/registerController';
import { verifyJWT } from './middlewares/verifyJWT';

export async function routes(app: FastifyInstance) {
	app.post('/users', registerController);
	app.post('/sessions', authenticateController);

	app.post('/gyms', { onRequest: [verifyJWT] }, createGymController);

	app.get('/me', { onRequest: [verifyJWT] }, getUserProfileController);
}
