import { ICreateUser } from "./../utils/schemas/users.schema";
export interface IUser extends ICreateUser {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProfileAvatarProps {
  name: string;
  size: "w-24 h-24" | "w-10 h-10";
  rounded?: boolean;
  color?: string;
}

export interface IUserStatus {
  id?: string;
  isActive: boolean;
}

export interface IUpdateUserProfile extends Partial<IUser> {
  id: string;
}
