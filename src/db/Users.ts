import { Sequelize, Table, Column, Model, HasMany } from "sequelize-typescript";


// https://github.com/RobinBuschmann/sequelize-typescript
@Table({
	timestamps: false,
	tableName: "Users"
})
export class Users extends Model<Users> {

	@Column({ primaryKey: true, allowNull: false, unique: true })
	UserId: string;

	@Column({ allowNull: false, unique: true })
	Email: string;

	@Column({ defaultValue: "c21f969b5f03d33d43e04f8f136e7682", allowNull: false })
	Password: string;

	@Column
	FirstName: string;

	@Column
	LastName: string;

	@Column({ defaultValue: undefined })
	ImageUrl: string;

	@Column({ defaultValue: 0 })
	Position: number;

	@Column({ defaultValue: undefined, unique: true })
	FacebookId: string;

	@Column({ defaultValue: 0 })
	UserType: number;
}