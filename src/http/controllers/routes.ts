import { FastifyInstance } from 'fastify';
import { checkInRoutes } from './CheckIns/checkIn.routes';
import { gymsRoutes } from './Gyms/gyms.routes';
import { usersRoutes } from './Users/users.routes';

export async function routes(app: FastifyInstance) {
	app.register(usersRoutes);
	app.register(gymsRoutes);
	app.register(checkInRoutes);
}
