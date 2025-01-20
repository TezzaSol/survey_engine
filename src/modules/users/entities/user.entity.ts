import { Exclude, Expose } from "class-transformer";

export class UserEntity {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  phoneNumber: string;
  department: string;
  role: string;
  createdAt: Date;
  loggedInActivity?: boolean;
  status?: string;

  @Exclude()
  password?: string;
  @Exclude()
  updatedAt?: Date;

  // @Expose()
  // get status(): string {
  //   return this.password ? "active" : "inactive";
  // }

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
