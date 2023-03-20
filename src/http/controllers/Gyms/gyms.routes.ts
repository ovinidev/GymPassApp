import { FastifyInstance } from 'fastify';
import { verifyJWT } from '@http/middlewares/verifyJWT';
import { createGymController } from '@http/controllers/Gyms/createGymController';
import { fetchNearbyGymsController } from '@http/controllers/Gyms/fetchNearbyGymsController';
import { searchGymsController } from '@http/controllers/Gyms/searchGymsController';

export async function gymsRoutes(app: FastifyInstance) {
	app.addHook('onRequest', verifyJWT);

	app.post('/gyms', createGymController);
	app.get('/gyms', fetchNearbyGymsController);
	app.get('/gyms/:name', searchGymsController);
}
