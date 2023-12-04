import { ModeToggle } from '@/components/mode-toggle'
import { Card } from '@/components/ui/card'
import { useDispatch, useSelector } from '@/lib/redux'
import { selectUser, userAsync, userSlice } from '@/lib/redux/slices/userSlice'
import axios from 'axios'
import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

const Layout = () => {
    const dispatch = useDispatch()
    const user = useSelector(selectUser)
    const navigate = useNavigate()
    useEffect(() => {
        dispatch(userAsync())
    }, [dispatch])

    useEffect(() => {
        axios.interceptors.response.use(res => {
            console.log({ res })
            if (res.data?.isAuth == 'no') {
                dispatch(userSlice.actions.setIsAuth('no'))
            }
            return res
        }, err => {
            console.log({ resErr_i: err })
            return Promise.reject(err);

        });

    }, [])
    useEffect(() => {
        if (user.isAuth == 'no') {
            navigate('/login')
        }
    }, [user.isAuth])

    return (
        <div className='px-2 w-full'>
            {/* make a modal if user.isAuth =='no' then open  */}
            {user.isAuth == 'no' && <Card className='fixed inset-0 h-full w-full bg-orange-500'>
                <h1 className='text-center text-2xl font-bold'>Please Login</h1>
                <h1 className='text-center text-2xl font-bold'>{user.data.first_name}</h1>
            </Card>}
            <ModeToggle />
            <Outlet />
        </div>
    )
}

export default Layout