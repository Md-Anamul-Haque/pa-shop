
import { auth } from '@/helpers/auth'
import { handleLogoutPOST } from './handlelogout'


export const POST = [auth, handleLogoutPOST]
