import { auth } from "@/helpers/auth";
import { handleOrgGET } from "./handleGET";
import { handleOrgPOST } from "./handlePOST";

export const GET = [auth, auth.isSu_admin, handleOrgGET]
export const POST = [auth, auth.isSu_admin, handleOrgPOST]
