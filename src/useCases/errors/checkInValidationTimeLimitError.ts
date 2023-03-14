export class CheckInValidationTimeLimitError extends Error {
	constructor() {
		super('Expired check-in validation time');
	}
}
