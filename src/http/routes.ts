import { FastifyInstance } from 'fastify';
import { authenticateController } from './controllers/authenticateController';
import { checkInController } from './controllers/checkInController';
import { createGymController } from './controllers/createGymController';
import { fetchCheckInHistoryController } from './controllers/fetchCheckInHistoryController';
import { fetchNearbyGymsController } from './controllers/fetchNearbyGymsController';
import { getUserMetricsController } from './controllers/getUserMetricsController';
import { getUserProfileController } from './controllers/getUserProfileController';
import { registerController } from './controllers/registerController';
import { searchGymsController } from './controllers/searchGymsController';
import { validateCheckInController } from './controllers/validateCheckInController';
import { verifyJWT } from './middlewares/verifyJWT';

export async function routes(app: FastifyInstance) {
	app.post('/users', registerController);
	app.get('/users', { onRequest: [verifyJWT] }, getUserMetricsController);

	app.post('/sessions', authenticateController);

	app.post('/gyms', { onRequest: [verifyJWT] }, createGymController);
	app.get('/gyms', { onRequest: [verifyJWT] }, fetchNearbyGymsController);
	app.get('/gyms/:name', { onRequest: [verifyJWT] }, searchGymsController);

	app.post('/checkIns', { onRequest: [verifyJWT] }, checkInController);
	app.get(
		'/checkIns/:checkInId',
		{ onRequest: [verifyJWT] },
		validateCheckInController,
	);
	app.get(
		'/checkIns',
		{ onRequest: [verifyJWT] },
		fetchCheckInHistoryController,
	);

	app.get('/me', { onRequest: [verifyJWT] }, getUserProfileController);
}
