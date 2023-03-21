import { FastifyInstance } from 'fastify';
import { checkInController } from '@http/controllers/CheckIns/checkInController';
import { fetchCheckInHistoryController } from '@http/controllers/CheckIns/fetchCheckInHistoryController';
import { validateCheckInController } from '@http/controllers/CheckIns/validateCheckInController';
import { verifyJWT } from '@http/middlewares/verifyJWT';
import { verifyIsAdmin } from '@http/middlewares/verifyIsAdmin';

export async function checkInRoutes(app: FastifyInstance) {
	app.addHook('onRequest', verifyJWT);

	app.post('/checkIns', checkInController);
	app.get(
		'/checkIns/:checkInId',
		{ onRequest: verifyIsAdmin },
		validateCheckInController,
	);
	app.get('/checkIns', fetchCheckInHistoryController);
}
