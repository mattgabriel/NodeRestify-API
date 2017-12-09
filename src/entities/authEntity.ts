import { config } from "../config/config";
import { ApiError, ErrorCode, ErrorMsg } from "../helpers/apiErrors";
import { Dates } from "../helpers/dates";
import { Users } from "../db/Users";
import { AuthTokens } from "../db/AuthTokens";
import { UserTokens } from "../db/UserTokens"; // Legacy

export class AuthEntity {

	/**
	 * If the user and password are found in the db
	 * it will return the userId and user role
	 */

	static validateCredentials(email: string, pass: string, callback: (n: boolean, e: string, userId?: string, userRole?: number) => void): void {

		Users.findOne({ where: {Email: email, Password: pass} }).then(response => {
			if (response) {
				const user = response as Users;
				// TODO: set the correct userRole
				callback(true, "", user.UserId, 100);
			} else {
				callback(false, ErrorMsg.Auth_InvalidCredentials);
			}
		}).catch(function(err) {
			callback(false, ErrorMsg.Auth_InvalidCredentials);
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
		AuthTokens.findOne({
			where: { UserId: userId, TokenId: jti }
		}).then(response => {
			if (response) {
				callback(true);
			} else {
				callback(false, ErrorMsg.Auth_InvalidToken);
			}
		}).catch(function(err) {
			callback(false, ErrorMsg.Auth_InvalidToken);
		});
	}



	/**
	 *
	 * After generating a new refres token we need to store it in the DB
	 * just so the user can later request new access tokens by providing this refresh token
	 *
	 */

	static storeRefreshToken(userId: string, tokenId: string, tokenIdLegacy: string, callback: (s: boolean, e?: ErrorMsg) => void): void {
		const create = AuthTokens.create({
			UserId: userId,
			TokenId: tokenId,
			Created: Dates.now(),
			Expiry: Dates.nowPlusSeconds(60 * 60 * 24 * 365) // 1 year in the future
		}).then(function(row) {

			// legacy call, can be removed once API v2 is no longer in use
			AuthEntity.storeRefreshTokenLegacy(userId, tokenIdLegacy, function(s: boolean, e?: ErrorMsg) {
				if (s) return callback(true);
				return callback(false, e);
			});

		}).catch(function(err) {
			callback(false, ErrorMsg.General_DatabaseError);
		});
	}


	/**
	 *
	 * API v2 needs the tokens to be stored on another table
	 * as soon as API v2 is no longer in use we can remove this method
	 *
	 */

	static storeRefreshTokenLegacy(userId: string, tokenId: string, callback: (s: boolean, e?: ErrorMsg) => void): void {
		const create = UserTokens.create({
			UserId: userId,
			TokenId: tokenId,
			Expiry: Dates.nowPlusSeconds(60 * 60 * 24 * 365) // 1 year in the future
		}).then(function(row) {
			callback(true);
		}).catch(function(err) {
			callback(false, ErrorMsg.General_DatabaseError);
		});
	}


// Users.findOne().then(response => {
// 	const user = response as Users;
// 	const x = user.Email as string;
// 	console.log(user.Email);
// 	console.log(x);
// });


// Users.findAll({ attributes: ["FirstName"] }).then(response => {
// 	response.forEach(function(item) {
// 		const user = item as Users;
// 		console.log(user.FirstName);
// 		console.log(item.getDataValue("FirstName"));
// 	});
// });


// const create = Users.create({
// 	Email: "test@x.com",
// 	FirstName: "matt",
// 	LastName: "test",
// 	UserId: "abcde",
// 	Password: "someSecureEncryptedPasswordHere"
// }).then(function(user) {
// 	console.log(user);
// }).catch(function(err) {
// 	// notNull Violation: Users.UserId cannot be null
// 	// Validation error (when trying to add a duplicate email/userId)
// 	console.log(err.message);
// });

// try {
// 	const user = Users.findOne({ where: {Email: email, Password: pass} });
// 	console.log("good");
// 	console.log(user);
// } catch (err) {
// 	console.log("error");
// }

}

