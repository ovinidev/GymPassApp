import { FastifyReply } from 'fastify';
import { ZodError } from 'zod';

interface ZodErrorProps {
	reply: FastifyReply;
	err: ZodError;
}

export function zodErrorsFormatted({ err, reply }: ZodErrorProps) {
	const zodErrors = err.errors.map((error) => {
		return error.message;
	});

	const zodErrosFormatted = { errors: zodErrors };

	reply.status(400).send(zodErrosFormatted);
}
