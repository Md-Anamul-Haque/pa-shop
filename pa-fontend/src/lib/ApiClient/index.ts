/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ToastOptions, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
type toastMessagesType = {

  loading?: string;
  success?: string;
  error?: string;

}
type getProps = { config?: AxiosRequestConfig, toastMessages?: toastMessagesType, withToast: boolean };
type postProps = { data?: any; config?: AxiosRequestConfig, toastMessages?: toastMessagesType, withToast: boolean };
class ApiClient {
  private client;
  private toastOptions: ToastOptions;
  constructor(baseURL: string, toastOptions?: ToastOptions) {
    this.toastOptions = toastOptions || {};
    this.client = axios.create({
      baseURL,
    });

  }

  private async request<T>(method: string, endpoint: string, {
    data, config, toastMessages, withToast
  }: {
    data?: any, config?: AxiosRequestConfig, toastMessages?: toastMessagesType, withToast: boolean
  }): Promise<T> {
    const handleRequest = async () => {
      try {
        const response: AxiosResponse<T> = await this.client.request<T>({
          method,
          url: endpoint,
          data,
          ...config,
        });
        return response.data;
      } catch (error) {

        throw this.handleError(error as AxiosError);
      }
    }
    const resolveHandler = handleRequest();
    this.showToast(resolveHandler, { messages: toastMessages, withToast })
    return resolveHandler
  }

  get<T = any>(endpoint: string, getProp?: getProps) {
    const { config, toastMessages, withToast = false } = getProp || {};
    return this.request<T>('get', endpoint, { config, toastMessages, withToast });
    // const [data, setData] = useState<apiResponceType<T>>();
    // const [error, setError] = useState<string | null>(null);
    // const [isLoading, setIsLoading] = useState(true);
    // useEffect(() => {
    //   const fetchData = async () => {
    //     setIsLoading(true);
    //     try {
    //       const response: any = await this.request<T>('get', endpoint, { config, toastMessages, withToast });
    //       if (!response) {
    //         throw new Error(`HTTP error! Status: ${response}`);
    //       }
    //       setData(response as apiResponceType<T>);
    //     } catch (error: any) {
    //       alert(JSON.stringify({ error }))

    //       setError(String(error?.message));
    //     } finally {
    //       setIsLoading(false);
    //     }
    //   };
    //   fetchData();
    // }, [endpoint]);
    // return { data, error, isLoading };
  }

  post<T = any>(endpoint: string, postProp: postProps) {
    const { data, config, toastMessages, withToast = true } = postProp || {};
    return this.request<T>('post', endpoint, { data, config, toastMessages, withToast });
    // const [resData, setResData] = useState<apiResponceType<T>>();
    // const [error, setError] = useState<string | null>(null);
    // const [isLoading, setIsLoading] = useState(true);
    // useEffect(() => {
    //   const fetchData = async () => {
    //     setIsLoading(true);
    //     try {
    //       const response: any = await this.request<T>('post', endpoint, { data, config, toastMessages, withToast });
    //       if (!response) {
    //         throw new Error(`HTTP error! Status: ${response}`);
    //       }
    //       setResData(response as apiResponceType<T>);
    //     } catch (error: any) {
    //       alert(JSON.stringify({ error }))

    //       setError(String(error?.message));
    //     } finally {
    //       setIsLoading(false);
    //     }
    //   };
    //   fetchData();
    // }, [endpoint, data]);
    // return { data: resData, error, isLoading };
  }

  put<T>(endpoint: string, { data, config, toastMessages, withToast = true }: { data?: any, config?: AxiosRequestConfig, toastMessages?: toastMessagesType, withToast: boolean }): Promise<T> {
    const resolveWithSomeData = this.request<T>('put', endpoint, { data, config, toastMessages, withToast });
    return resolveWithSomeData
  }

  delete<T>(endpoint: string, { config, toastMessages, withToast = true }: { config?: AxiosRequestConfig, toastMessages?: toastMessagesType; withToast: boolean }): Promise<T> {
    const resolveWithSomeData = this.request<T>('delete', endpoint, { config, toastMessages, withToast });
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
