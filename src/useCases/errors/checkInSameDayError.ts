export class CheckInSameDayError extends Error {
	constructor() {
		super('It is not possible to check in twice');
	}
}
