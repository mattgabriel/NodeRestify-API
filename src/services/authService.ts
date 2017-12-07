import * as conf from "../config/config";
import * as restify from "restify";
import * as jwt from "jwt-simple";
import { Token } from "../models/authModel";
import { TokenObject } from "../models/authModel";
import { ApiError, ErrorCode, ErrorMsg } from "../helpers/apiErrors";
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
	private _userId: string;
	private _userRole: number;
	private _refreshTokenObject: TokenObject;
	private _accessToken: string;
	private _accessTokenExpiration: number = conf.config.accessTokenLifespan;
	private _refreshToken: string;

	authenticate(req: restify.Request, res: restify.Response, callback: (success: boolean, error?: any, response?: any) => void): void {

		if (req.body && req.body.refreshToken) {
			// With refresh token
			this.authenticateWithRefreshToken(req, function(s: boolean, e?: ErrorMsg) {
				if (s) return callback(true);
				return callback(false, ApiError.httpResponse(e as ErrorMsg, ErrorCode.UnauthorizedError) );
			});
		} else if (req.body && req.body.email && req.body.password ) {
			// With credentials
			this.authenticateWithCredentials(req, function(s: boolean, e?: ErrorMsg) {
				if (s) return callback(true);
				return callback(false, ApiError.httpResponse(e as ErrorMsg, ErrorCode.UnauthorizedError) );
			});
		} else {
			return callback(false, ApiError.httpResponse(ErrorMsg.Auth_InsufficientParameters, ErrorCode.UnauthorizedError) );
		}
	}

	validateAccessToken(req: restify.Request, callback: (success: boolean, error?: any, response?: any) => void): void {
		if (req.headers.authorization) {
			// With refresh token
			try {
				const refresh_token = this.parseBearerToken(req);
				try {
					const validated = this.setRefreshTokenObject(refresh_token);
					this._accessToken = this.token.generateAccessToken(this._refreshTokenObject.userId);
					this._userId = this._refreshTokenObject.userId;
					// this.useRole = this._refreshTokenObject.userRole;
					// contains the same refresh token as provided by the user
					// no need to create a new refresh token a
					this._refreshToken = refresh_token;
					return callback(true);
				} catch (err) {
					return callback(false, ApiError.httpResponse(err, ErrorCode.UnauthorizedError) );
				}
			} catch (err) {
				return callback(false, ApiError.httpResponse(ErrorMsg.Auth_InvalidCredentials, ErrorCode.UnauthorizedError) );
			}
		} else {
			return callback(false, ApiError.httpResponse(ErrorMsg.Auth_InsufficientParameters, ErrorCode.UnauthorizedError) );
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

	get userId() {
		return this._userId;
	}

	private authenticateWithRefreshToken(req: restify.Request, callback: (s: boolean, e?: ErrorMsg) => void): void {
		const _this = this;
		const refresh_token = req.body.refreshToken;
		try {
			const validated = this.setRefreshTokenObject(refresh_token);
			this._userId = this._refreshTokenObject.userId;
			const jti = this._refreshTokenObject.jti;
			AuthEntity.validateRefreshToken(jti, this._userId, function(s: boolean, e?: ErrorMsg) {
				if (s) {
					_this._accessToken = _this.token.generateAccessToken(_this._refreshTokenObject.userId);
					// this.useRole = this._refreshTokenObject.userRole;
					// contains the same refresh token as provided by the user
					// no need to create a new refresh token a
					_this._refreshToken = refresh_token;
					return callback(true);
				} else {
					return callback(false, e);
				}
			});
		} catch (err) {
			return callback(false, err);
		}
	}

	private authenticateWithCredentials(req: restify.Request, callback: (s: boolean, e?: ErrorMsg) => void): void {
		const _this = this;
		AuthEntity.validateCredentials(req.body.email, req.body.password, function(success: boolean, error: string, userId?: string, userRole?: number) {
			if (success) {
				_this._userId = userId as string;
				_this._userRole = userRole as number;
				_this._refreshToken = _this.token.generateRefreshToken(_this.userId);
				_this._accessToken = _this.token.generateAccessToken(_this.userId);

				const token = _this.token.decode(_this._refreshToken);
				AuthEntity.storeRefreshToken(_this._userId, token.jti, function(s: boolean, e?: string) {
					if (s) return callback(true);
					return callback(false, ErrorMsg.General_DatabaseError );
				});
			} else {
				return callback(false, ErrorMsg.Auth_InvalidCredentials);
			}
		});
	}

	private parseBearerToken(req: restify.Request): string {
		if (req.headers.authorization) {
			const auth = req.headers.authorization as string;
			if (auth.split(" ")[0] === "Bearer") {
				return auth.split(" ")[1];
			}
		}
		throw ErrorMsg.Auth_MissingToken;
	}

	private setRefreshTokenObject(refresh_token: string): boolean {
		try {
			const tokenObj = this.token.decode(refresh_token);
			if (!tokenObj.isExpired()) {
				// set public property and return true
				this._refreshTokenObject = tokenObj;
				return true;
			}
			throw ErrorMsg.Auth_ExpiredToken;
		} catch (err) {
			// invalid refresh_token (can't decode)
			throw err;
		}
	}
}


export class AuthMiddleware {

	/**
	 *
	 * Treated as middleware
	 * Routes that need validating the access token in order to continue
	 * will call this method which if the token is invalid will continue to the next route
	 * or if invalid it will return a HTTP Unauthorized error
	 *
	 */
	static validateAccessToken(req: restify.Request, res: restify.Response, next: restify.Next): void {
		const auth = new Auth();
		auth.validateAccessToken(req, function(success: boolean, error: ApiError) {
			if (!success) {
				return next(error);
			}
			return next();
		});
	}
}

