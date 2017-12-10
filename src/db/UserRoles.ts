// import { Sequelize, Table, Column, Model, HasMany, HasOne, BelongsToMany, BelongsTo, ForeignKey } from "sequelize-typescript";
// import { Users } from "./Users";

// // https://github.com/RobinBuschmann/sequelize-typescript
// @Table({
// 	timestamps: false,
// 	tableName: "UserRoles"
// })
// export class UserRoles extends Model<UserRoles> {

// 	@ForeignKey(() => Users)
// 	// @Column({ primaryKey: true, allowNull: false, unique: true, field: "UserId"})
// 	@BelongsTo(() => Users, {as: "UserId"})
// 	UserIds: string;

// 	@Column({ allowNull: false })
// 	RoleId: number;

// 	@Column
// 	StartDate: Date;

// 	@Column({ defaultValue: "2060-01-01 00:00:00", allowNull: false })
// 	EndDate: Date;

// }