
import { auth } from '@/helpers/auth'
import { handleMeGET } from './handleMeGET'


export const GET = [auth, handleMeGET]
