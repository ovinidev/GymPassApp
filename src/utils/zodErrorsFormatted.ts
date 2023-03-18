import { ZodError } from 'zod';

interface ZodErrorProps {
	err: ZodError;
}

export function zodErrorsFormatted({ err }: ZodErrorProps) {
	const zodErrors = err.errors.map((error) => {
		return error.message;
	});

	return { errors: zodErrors };
}
