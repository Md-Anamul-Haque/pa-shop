export type apiResponceType<T = any> = {
    success: boolean;
    isAuth?: string;
    message: string;
    payload: T
}