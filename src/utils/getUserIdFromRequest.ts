import { CustomRequest } from "../application/interface/CustomRequest";

// utility.ts
export function getUserIdFromRequest(req: CustomRequest): string | null {
    if (req.user && typeof req.user !== 'string') {
      return req.user.id; // Assuming `req.user` is CustomJwtPayload with an `id`
    }
    return null;
  }
  