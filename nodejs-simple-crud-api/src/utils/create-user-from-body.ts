import { User } from "../interfaces/User";
import { ERRORS_MAP } from "./constants/constants";

export function createUserFromBody(body: any): User {
  const requiredKeys = ['username', 'hobbies', 'age'];
  const newUser: any = {};
  if (!Object.keys(body).length) {
    throw new Error(ERRORS_MAP.BODY_REQUIRED);
  }
  for (const key of requiredKeys) {
    if (!body[key]) {
      throw new Error(ERRORS_MAP.BODY_MISSED_KEY);
    }
    newUser[key] = body[key];
  }
  return newUser as User;
}
