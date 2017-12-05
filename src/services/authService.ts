import * as conf from "../config/config";
import * as restify from "restify";
import * as jwt from "jwt-simple";
import { Token } from "../models/authModel";
import { TokenObject } from "../models/authModel";
import { ApiError, ErrorCode } from "../helpers/apiErrors";
import { AuthEntity } from "../entities/authEntity";


/**
 *
 * Look for a token in the request
 * If not found kill the request and respond with a http error
 * Otherwise decode it and:
 *  - If valid return success
 *  - If invalid return the error
 *
 */
export class Auth {

	// token: string;
	private token: Token = new Token;
	private userId: string;
	private userRole: number;
	private _refreshTokenObject: TokenObject;
	private _accessToken: string;
	private _accessTokenExpiration: number = conf.config.accessTokenLifespan;
	private _refreshToken: string;

	authenticate(req: restify.Request, res: restify.Response, callback: (success: boolean, error?: any, response?: any) => void): void {
		const _this = this;

		if (req.headers.authorization) {
			// With refresh token
			try {
				const refresh_token = this.parseBearerToken(req);
				try {
					const validated = this.validateRefreshToken(refresh_token);
					this._accessToken = this.token.generateAccessToken(this._refreshTokenObject.userId);
					// contains the same refresh token as provided by the user
					// no need to create a new refresh token a
					this._refreshToken = refresh_token;
					callback(true);
				} catch (err) {
					callback(false, ApiError.httpResponse(err, ErrorCode.UnauthorizedError) );
				}
			} catch (err) {
				callback(false, ApiError.httpResponse(ApiError.Auth.InvalidCredentials, ErrorCode.UnauthorizedError) );
			}

		} else if (req.body && req.body.email && req.body.password ) {
			AuthEntity.validateCredentials(req.body.email, req.body.password, function(success: boolean, error: string) {
				if (success) {
					_this._refreshToken = _this.token.generateRefreshToken(_this.userId);
					_this._accessToken = _this.token.generateAccessToken(_this.userId);
					// this.userId = details.userId as string;
					// this.userRole = details.userRole as number;
					callback(true);
				} else {
					callback(false, ApiError.httpResponse(ApiError.Auth.InvalidCredentials, ErrorCode.UnauthorizedError) );
				}
			});
		} else {
			callback(false, ApiError.httpResponse(ApiError.Auth.InsufficientParameters, ErrorCode.UnauthorizedError) );
		}
	}

	get accessToken() {
		return this._accessToken;
	}

	get accessTokenExpiration() {
		return this._accessTokenExpiration;
	}

	get refreshToken() {
		return this._refreshToken;
	}

	get refreshTokenObject(): TokenObject {
		return this._refreshTokenObject;
	}

	private parseBearerToken(req: restify.Request): string {
		if (req.headers.authorization) {
			const auth = req.headers.authorization as string;
			if (auth.split(" ")[0] === "Bearer") {
				return auth.split(" ")[1];
			}
		}
		throw ApiError.Auth.MissingToken;
	}

	private validateRefreshToken(refresh_token: string): boolean {
		try {
			const tokenObj = this.token.decode(refresh_token);
			if (!tokenObj.isExpired()) {
				// set public property and return true
				this._refreshTokenObject = tokenObj;
				return true;
			}
			throw ApiError.Auth.ExpiredToken;
		} catch (err) {
			// invalid refresh_token (can't decode)
			throw err;
		}
	}

}