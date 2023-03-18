import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
	NODE_ENV: z.enum(['dev', 'test', 'production']).default('dev'),
	PORT: z.coerce.number().default(3333),
	JWT_SECRET: z.string(),
	DATABASE_URL: z.string(),
	POSTGRESQL_USERNAME: z.string(),
	POSTGRESQL_PASSWORD: z.string(),
	POSTGRESQL_DATABASE: z.string(),
});

const _env = envSchema.safeParse(process.env);

const isInvalidEnvironmentVariables = _env.success === false;

if (isInvalidEnvironmentVariables) {
	console.error('Invalid environment variables', _env.error.format());

	throw new Error('❌ Invalid environment variables.');
}

export const env = _env.data;
