import { UserTokenType } from "./userTypes.ts";

declare global {
  namespace Express {
    interface Request {
      user?: UserTokenType;
    }
  }
}
