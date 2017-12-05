import * as conf from "../config/config";
import * as restify from "restify";
import * as jwt from "jwt-simple";
import { Random } from "../helpers/random";
import { ApiError, ErrorCode, ErrorMsg } from "../helpers/apiErrors";


export class TokenObject {

	readonly iss: string; // issuer
	readonly jti: string; // token ID
	readonly iat: number; // issue timestamp
	readonly exp: number; // expiration timestamp
	readonly userId: string;
	readonly isRefreshToken: boolean;

	constructor(tokenId: string, userId: string, issuer: string, issueDate: number, expiryDate: number, isRefreshToken: boolean = false) {
		this.iss = issuer;
		this.jti = tokenId;
		this.iat = issueDate;
		this.exp = expiryDate;
		this.userId = userId || "noUsr";
		this.isRefreshToken = isRefreshToken;
	}

	isExpired(): boolean {
		const currentDate = Math.floor(Date.now() / 1000);
		if (this.exp > currentDate) {
			return false;
		}
		return true;
	}
}


export class Token {

	// must not change until full API migration is completed
	private issuer: string = "http://tracktics.zone";


	encode(token: TokenObject): string {
		const encoded = jwt.encode(token, conf.config.authSecret);
		return encoded;
	}

	decode(token: string): TokenObject {
		try {
			const decoded = jwt.decode(token, conf.config.authSecret);
			try {
				const adapted = this.adapt(decoded);
				return adapted;
			} catch (err) {
				throw err;
			}
		} catch (err) {
			if (err.message === "Token expired") {
				throw ErrorMsg.Auth_ExpiredToken;
			} else {
				throw ErrorMsg.Auth_InvalidToken;
			}
		}
	}

	generateAccessToken(userId: string): string {
		const token = new TokenObject(
			Random.string(8),
			userId,
			this.issuer,
			Math.floor(Date.now() / 1000),
			Math.floor(Date.now() / 1000) + conf.config.accessTokenLifespan,
			false);
		return this.encode(token);
	}

	generateRefreshToken(userId: string): string {
		const token = new TokenObject(
			Random.string(8),
			userId,
			this.issuer,
			Math.floor(Date.now() / 1000),
			Math.floor(Date.now() / 1000) + conf.config.refreshTokenLifespan,
			true);
		return this.encode(token);
	}

	private adapt(decoded: any): TokenObject {
		if (decoded.iss && decoded.jti && decoded.iat && decoded.exp && decoded.userId) {
			let isRefreshToken: boolean = false;
			if (decoded.isRefreshToken) {
				isRefreshToken = decoded.isRefreshToken as boolean;
			}
			return new TokenObject(decoded.jti, decoded.userId, decoded.iss, decoded.iat, decoded.exp, isRefreshToken);
		}
		throw ErrorMsg.Auth_UnadaptableToken;
	}

}
