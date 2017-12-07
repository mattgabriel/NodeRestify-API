import { Sequelize, Table, Column, Model, HasMany } from "sequelize-typescript";


// https://github.com/RobinBuschmann/sequelize-typescript
@Table({
	timestamps: false,
	tableName: "UserRoles"
})
export class UserRoles extends Model<UserRoles> {

	@Column({ primaryKey: true, allowNull: false, unique: true })
	UserId: string;

	@Column({ allowNull: false })
	RoleId: number;

	@Column
	StartDate: Date;

	@Column({ defaultValue: "2060-01-01 00:00:00", allowNull: false })
	EndDate: Date;

}