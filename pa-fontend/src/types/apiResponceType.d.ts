export type apiResponceType<T = any> = {
    success: boolean;
    message: string;
    payload: T
}