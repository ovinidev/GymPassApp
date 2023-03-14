import { Gym, Prisma } from '@prisma/client';

export interface FindManyNearby {
	latitude: number;
	longitude: number;
}

export interface GymsRepository {
	create(data: Prisma.GymCreateInput): Promise<Gym>;
	findById(id: string): Promise<Gym | null>;
	findManyNearby(coordinates: FindManyNearby): Promise<Gym[]>;
	searchManyByName(
		name: string,
		page: number,
		pageLength: number,
	): Promise<Gym[] | null>;
}
