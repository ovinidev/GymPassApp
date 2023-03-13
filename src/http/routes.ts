import { FastifyInstance } from 'fastify';
import { authenticateController } from './controllers/authenticateController';
import { getUserProfileController } from './controllers/getUserProfileController';
import { registerController } from './controllers/registerController';

export async function appRoutes(app: FastifyInstance) {
	app.post('/users', registerController);
	app.get('/users/:userId', getUserProfileController);

	app.post('/sessions', authenticateController);
}
