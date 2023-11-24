/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiResponceType } from '@/types/apiResponceType';
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ToastOptions, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { buildApiUrl } from '../utils';
type toastMessagesType = {
  loading?: string;
  success?: string;
  error?: string;
}

type getProps = { config?: AxiosRequestConfig, toastMessages?: toastMessagesType, withToast?: boolean, params?: Record<string, string> };
type postProps = { data?: any; config?: AxiosRequestConfig, toastMessages?: toastMessagesType, withToast: boolean, params?: Record<string, string> };
class ApiClient {
  // private client;
  private toastOptions: ToastOptions;
  private baseURL: string;
  private withCredentials: boolean;
  constructor(props?: ({ baseURL: string; toastOptions?: ToastOptions } | string)) {
    this.toastOptions = typeof props === 'string' ? { position: 'top-right', autoClose: 5000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, theme: 'light' } : props?.toastOptions || {};
    this.baseURL = (typeof props === 'string' ? props : props?.baseURL) || '/api';
    this.withCredentials = true;
    // this.client = axios.create({
    //   baseURL: (typeof props === 'string' ? props : props?.baseURL) || '/api',
    //   withCredentials: true,
    // });
  }

  private async request<T>(method: string, endpoint: string, {
    data, config, toastMessages, withToast, params
  }: {
    data?: any, config?: AxiosRequestConfig, toastMessages?: toastMessagesType, withToast: boolean; params?: Record<string, string>
  }): Promise<T> {
    const handleRequest = async () => {
      try {
        const response: AxiosResponse<T> = await axios({
          method,
          url: buildApiUrl(this.baseURL, endpoint, params),
          data,
          withCredentials: this.withCredentials,
          ...config
        });
        // this.client.request<T>({
        //   method,
        //   url: endpoint,
        //   data,
        //   ...config,
        // });
        const resData = response.data as any;
        return resData;
      } catch (error) {
        const resErr = this.handleError(error as AxiosError);
        throw resErr;
      }
    }
    const resolveHandler = handleRequest();
    this.showToast(resolveHandler, { messages: toastMessages, withToast })
    return resolveHandler
  }

  get<T = any>(endpoint: string = '', getProp?: getProps) {
    const { config, toastMessages, withToast = false, params } = getProp || {};
    return this.request<apiResponceType<T>>('get', endpoint, { config, toastMessages, withToast, params });
  }

  post<T = any>(endpoint: string, postProp: postProps) {
    const { data, config, toastMessages, withToast = true, params } = postProp || {};
    return this.request<apiResponceType<T>>('post', endpoint, { data, config, toastMessages, withToast, params });
  }

  put<T = any>(endpoint: string, { data, config, toastMessages, withToast = true, params }: { data?: any, config?: AxiosRequestConfig, toastMessages?: toastMessagesType, withToast: boolean; params?: Record<string, string> }) {
    return this.request<apiResponceType<T>>('put', endpoint, { data, config, toastMessages, withToast, params });
  }

  delete<T = any>(endpoint: string, { config, toastMessages, withToast = true, params }: { config?: AxiosRequestConfig, toastMessages?: toastMessagesType; withToast: boolean; params?: Record<string, string> }) {
    const resolveWithSomeData = this.request<apiResponceType<T>>('delete', endpoint, { config, toastMessages, withToast, params });
    return resolveWithSomeData
  }

  private handleError(error: AxiosError): any {

    if (error.response) {
      console.error('Response error:', error.response.data);
      return error.response.data;
    } else if (error.request) {
      console.error('Request error:', error.request);
      return { error: 'No response from the server' };
    } else {
      console.error('Error:', error.message);
      return { error: 'Request setup error' };
    }
  }

  private showToast(resolveWithSomeData: Promise<any>, { messages, withToast }: { messages?: toastMessagesType, withToast: boolean }): void {

    withToast && toast.promise(
      resolveWithSomeData,
      {
        pending: {
          render() {
            return messages?.loading || "Please wait..."
          },
          icon: false,
        },
        success: {
          render({ data }) {
            return messages?.success || data?.message
          },
          // other options
          icon: "🟢",
        },
        error: {
          render({ data }) {
            // When the promise reject, data will contains the error;
            // @ts-ignore
            return messages?.error || data?.message || "error: 'Promise rejected 🤯'"
          }
        }
        // error: 'error'
      },
      this.toastOptions
    );
  }

}

export default ApiClient;
