import { Prisma, User } from '@prisma/client';
import { UsersRepository } from '@repositories/contracts/usersRepository';
import { randomUUID } from 'node:crypto';

export class InMemoryUsersRepository implements UsersRepository {
	users: User[] = [];

	async create(data: Prisma.UserCreateInput): Promise<User> {
		const user = {
			created_at: new Date(),
			email: data.email,
			id: data.id ? data.id : randomUUID(),
			name: data.name,
			password_hash: data.password_hash,
		} as User;

		this.users.push(user);

		return user;
	}

	async findByEmail(email: string): Promise<User | null> {
		const user = this.users.find((user) => {
			return user.email === email;
		});

		if (!user) return null;

		return user;
	}

	async findById(id: string): Promise<User | null> {
		const user = this.users.find((user) => {
			return user.id === id;
		});

		if (!user) return null;

		return user;
	}
}
