import { Sequelize, Table, Column, Model, HasMany } from "sequelize-typescript";


// https://github.com/RobinBuschmann/sequelize-typescript
@Table({
	timestamps: false,
	tableName: "AuthTokens"
})
export class AuthTokens extends Model<AuthTokens> {

	@Column({ primaryKey: true, allowNull: false })
	UserId: string;

	@Column({ primaryKey: true, allowNull: false, unique: true })
	TokenId: string;

	@Column({ allowNull: false })
	Created: Date;

	@Column({ allowNull: false })
	Expiry: Date;

}