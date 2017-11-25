import * as conf from "../config/config";
import * as restify from "restify";
import * as errors from "restify-errors";
import * as jwt from "jwt-simple";


class TokenObject {

	private _userId: string;
	private _issueDate: Date;
	private _expiryDate: Date;
	private _isRefreshToken: boolean;

	constructor(userId: string, issueDate: Date,
		expiryDate: Date, isRefreshToken: boolean = false) {

		this._userId = userId;
		this._issueDate = issueDate;
		this._expiryDate = expiryDate;
		this._isRefreshToken = isRefreshToken;
	}

	get userId(): string {
		return this._userId;
	}

	get issueDate(): Date {
		return this._issueDate;
	}

	get expiryDate(): Date {
		return this._expiryDate;
	}

	get isRefreshToken(): boolean {
		return this._isRefreshToken;
	}

}


class Token {

	encode(token: TokenObject): string {
		return "test";
	}

	decode(token: string): TokenObject {
		try {
			const dec = jwt.decode(token, conf.config.authSecret);
			return new TokenObject("matt12", new Date(), new Date());
		} catch (err) {
			throw "InvalidToken";
		}
	}
}


/**
 *
 * Look for a token in the request
 * If not found kill the request and responde with a http error
 * Otherwise decode it and:
 *  - If valid return success
 *  - If invalid return the error
 *
 */
export class Auth {

	token: string;

	authenticate(req: restify.Request, res: restify.Response, next: restify.Next): boolean {
		if (this.parseToken(req)) {
			const tok = new Token();
			try {
				const decoded = tok.decode(this.token);
				console.log(decoded);
				return true;
			} catch (err) {
				next(new errors.UnauthorizedError(err));
				return false;
			}
		} else {
			next(new errors.UnauthorizedError("NoTokenFound"));
			return false;
		}
	}

	login(req: restify.Request, res: restify.Response, next: restify.Next): boolean {
		return true;
	}

	private parseToken(req: restify.Request): boolean {
		if (req.headers.authorization != undefined) {
			// First look for it in the header
			const authorization = req.headers.authorization as string;
			if (authorization.split(" ")[0] === "Bearer") {
				this.token = authorization.split(" ")[1];
				return true;
			}
		} else if (req.query && req.query.token) {
			// Then look for it in the query string
			this.token = req.query.token;
			return true;
		} else if (req.body && req.body.token) {
			// And finaly try in the body
			this.token = req.body.token;
			return true;
		}
		// No token found anywhere in the request
		return false;
	}

}







