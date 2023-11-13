
/* Core */
import { Provider } from 'react-redux'

/* Instruments */
import { ThemeProvider } from "@/components/theme-provider"
import { reduxStore } from '@/lib/redux'

export const Providers = (props: React.PropsWithChildren) => {
    return <Provider store={reduxStore}>
        <ThemeProvider>
            {props.children}
        </ThemeProvider>
    </Provider>
}