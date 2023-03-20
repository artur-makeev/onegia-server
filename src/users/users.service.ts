import { Injectable } from '@nestjs/common';

export type User = any;

@Injectable()
export class UsersService {
	private readonly users = [
		{
			userId: 1,
			email: `${process.env.ADMIN_EMAIL}`,
			password: `${process.env.ADMIN_PASSWORD}`,
		},
	];

	async findOne(email: string): Promise<User | undefined> {
		return this.users.find(user => user.email === email);
	}
}