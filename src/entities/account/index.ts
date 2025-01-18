import {PUBLIC_BACKEND_URL} from "$env/static/public";
import {BackendFetch} from "$shared/api";

export type TAccount = {
    id?: string | number;
    type: number;
    name: string;
    amount: number | string;
};

export const createAccount = async (data) => {
    let response = await BackendFetch(PUBLIC_BACKEND_URL + '/account', {
        method: 'POST',
        body: JSON.stringify(data),
    });


    return response.json();
}


export const getAccount = async (id: string) => {

}

export const getAccounts = async (): Promise<Array<TAccount>> => {
    let response = await BackendFetch(PUBLIC_BACKEND_URL + '/accounts');


    return response.json();
}
