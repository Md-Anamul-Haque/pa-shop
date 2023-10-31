import type { Request as expReq, Response as expRes } from "express";
import { userType } from "./tables.type";

export type Request = expReq & {
    auth?: {
        user?: userType,
        // org?: orgType
    }
}
export type Response = expRes