
/**
 *
 * NOTE:
 *
 * This is a legacy model, it is only used for compatibility with
 * API v2. On API v3 we store tokens in AuthTokens however API v2
 * does it in this table (UserTokens). Also API v2 doesn't have
 * refresh token, it only has access tokens which means we need
 * to store a long lived access token into this table just so thaT
 * API v2 can continue using other endpoints with this token.
 *
 */


import { Sequelize, Table, Column, Model, HasMany } from "sequelize-typescript";


// https://github.com/RobinBuschmann/sequelize-typescript
@Table({
	timestamps: false,
	tableName: "UserTokens"
})
export class UserTokens extends Model<UserTokens> {

	@Column({ primaryKey: true, allowNull: false })
	UserId: string;

	@Column({ primaryKey: true, allowNull: false, unique: true })
	TokenId: string;

	@Column({ allowNull: false })
	Expiry: Date;

}