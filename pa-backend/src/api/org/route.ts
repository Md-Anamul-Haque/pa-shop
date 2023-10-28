import { auth } from "@/helpers/auth";
import { handleOrgGET } from "./handleGET";
import { handleOrgPOST } from "./handlePOST";

export const GET = handleOrgGET
export const POST = [auth, handleOrgPOST]
