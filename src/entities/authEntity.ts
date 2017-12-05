import { config } from "../config/config";
import { ApiError, ErrorCode, ErrorMsg } from "../helpers/apiErrors";
import { Users } from "../db/Users";

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

