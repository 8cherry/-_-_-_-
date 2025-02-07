
import {PUBLIC_BACKEND_URL} from "$env/static/public";
import {BackendFetch} from "$shared/api";

export type TCategory = {
    id: string;
    name: string;
};

const createCategory = async (data) => {

}


const getCategory = async (id: string) => {

}

const getCategories = async (id: string) => {

}


export async function getIncomeCategories() {

    let response = await BackendFetch(PUBLIC_BACKEND_URL + '/categoryIn');
 
 
     return response.json();
}




export async function getExpensesCategories() {
    let response = await BackendFetch(PUBLIC_BACKEND_URL + '/categoryOut');
 
 
    return response.json();
}
