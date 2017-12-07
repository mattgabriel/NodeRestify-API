

export class Dates {

	static now(): string {
		return new Date(Date.now()).toLocaleString();
	}

	static nowUTC(): number {
		return new Date(Date.now()).getSeconds();
	}

	static nowPlusSeconds(numberOFSeconds: number): string {
		let timeObject = new Date();
		timeObject = new Date(timeObject.getTime() + 1000 * numberOFSeconds);
		return timeObject.toLocaleString();
	}

	static nowUTCPlusSeconds(numberOfSeconds: number): number {
		return new Date(Date.now()).getSeconds() + numberOfSeconds;
	}

}