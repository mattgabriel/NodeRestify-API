import { Random } from "../helpers/random";

export class Users {

	constructor(UserId: string = "") {
		if (UserId == "") {
			this.UserId = Random.string(5);
		}
	}

	public UserId: string;

	private _Email: string;
	get Email(): string {
		return this._Email;
	}
	set Email(value: string) {
		this._Email = value.toLowerCase();
	}

	public Password: string = "c21f969b5f03d33d43e04f8f136e7682"; // md5: default

	public FirstName: string;

	public LastName: string;

	public ImageUrl: string;

	public Position: number = 0;

	public FacebookId: string;

	public UserType: number = 0;
}