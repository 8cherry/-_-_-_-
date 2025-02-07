import {PUBLIC_BACKEND_URL} from "$env/static/public";
import {BackendFetch} from "$shared/api";

export type TTransaction = {
    date: string,
    amount: string,
    account: string,
    category: string,
    type: 1 | 2,
}

export const createTransaction = async (data) => {
    let response = await BackendFetch(PUBLIC_BACKEND_URL + '/transaction', {
        method: 'POST',
        body: JSON.stringify(data),
    });


    return response.json();
}


export const getTransaction = async (id: string) => {

}

export const getTransactions = async (filters?: Record<string, any>) => {
    let opts = '';

    if (filters) {
        opts = '?' + new URLSearchParams(filters).toString();
        console.log(opts);
        
    }


    let response = await BackendFetch(PUBLIC_BACKEND_URL + '/transactions' + opts);


    return response.json();
}



