import { config } from "../config/config";
import { ApiError, ErrorCode, ErrorMsg } from "../helpers/apiErrors";
import { Dates } from "../helpers/dates";
import { Users } from "../db/Users";
import { knex, TABLES } from "../config/db";

export class AuthEntity {

	/**
	 * If the user and password are found in the db
	 * it will return the userId and user role
	 */

	static validateCredentials(email: string, pass: string, callback: (n: boolean, e: string, userId?: string, userRole?: number) => void): void {
		knex.select("*")
		.from(TABLES.Users)
		.leftJoin(TABLES.UserRoles, `${TABLES.UserRoles}.UserId`, `${TABLES.Users}.UserId`)
		.where({
			Email: email,
			Password: pass
		})
		.limit(1).then(results => {
			if (results.length == 1) {
				const user = results[0];
				return callback(true, "", user.UserId, user.RoleId);
			} else {
				return callback(false, ErrorMsg.Auth_InvalidCredentials);
			}
		}).catch(function(err) {
			return callback(false, ErrorMsg.Auth_InvalidCredentials);
		});
	}


	/**
	 *
	 * If the user is requesting a new access token and they provided their refresh token
	 * we can validate it against the DB, if the jti (token ID) exists in the DB for the
	 * user making the request then we'll return true
	 *
	 */

	static validateRefreshToken(jti: string, userId: string, callback: (s: boolean, e?: ErrorMsg) => void): void {
		knex.select("*").from(TABLES.AuthTokens).where({
			UserId: userId,
			TokenId: jti
		}).limit(1).then(results => {
			if (results.length == 1) {
				return callback(true);
			} else {
				return callback(false, ErrorMsg.Auth_InvalidToken);
			}
		}).catch(function(err) {
			return callback(false, ErrorMsg.Auth_InvalidToken);
		});
	}



	/**
	 *
	 * After generating a new refres token we need to store it in the DB
	 * just so the user can later request new access tokens by providing this refresh token
	 *
	 */

	static storeRefreshToken(userId: string, tokenId: string, tokenIdLegacy: string, callback: (s: boolean, e?: ErrorMsg) => void): void {
		knex(TABLES.AuthTokens).insert({
			UserId: userId,
			TokenId: tokenId,
			Created: Dates.now(),
			Expiry: Dates.nowPlusSeconds(60 * 60 * 24 * 365) // 1 year in the future
		})
		.then(function(result) {
			return result;
		}).then(function(result) {

			// legacy call, can be removed once API v2 is no longer in use
			AuthEntity.storeRefreshTokenLegacy(userId, tokenIdLegacy, function(s: boolean, e?: ErrorMsg) {
				if (s) return callback(true);
				return callback(false, e);
			});

		}).catch(function(err) {
			return callback(false, ErrorMsg.General_DatabaseError);
		});
	}


	/**
	 *
	 * API v2 needs the tokens to be stored on another table
	 * as soon as API v2 is no longer in use we can remove this method
	 *
	 */

	static storeRefreshTokenLegacy(userId: string, tokenId: string, callback: (s: boolean, e?: ErrorMsg) => void): void {
		knex(TABLES.UserTokens).insert({
			UserId: userId,
			TokenId: tokenId,
			Expiry: Dates.nowPlusSeconds(60 * 60 * 24 * 365) // 1 year in the future
		})
		.then(function(result) {
			return callback(true);
		}).catch(function(err) {
			return callback(false, ErrorMsg.General_DatabaseError);
		});
	}


}

