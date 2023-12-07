import ApiClient from "@/lib/ApiClient";

const purApi = new ApiClient('/api/purchase')
export const getPurchases = () => {
    // return purApi.get<{ purchase: customerType[] }>(`?search=${search}&skip=${skip}`);

}