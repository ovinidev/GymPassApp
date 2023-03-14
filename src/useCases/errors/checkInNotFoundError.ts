export class checkInNotFoundError extends Error {
	constructor() {
		super('Check in not found');
	}
}
