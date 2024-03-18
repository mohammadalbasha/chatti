import { Pagination } from "../../common/types/pagination";
import { UserDoc } from "../models/user.model";

export type SigninInput = {
  name: string;
  password: string;
};

export type SigninResponse = {
  accessToken: string;
  user: UserDoc;
};

export type UserFilter = Partial<UserDoc>;

export type ListUnAddedUsers = {
  filter: UserFilter;
  pagination: Pagination;
};
