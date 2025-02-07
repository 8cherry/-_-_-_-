import {PUBLIC_BACKEND_URL} from "$env/static/public";
import {BackendFetch} from "$shared/api";

export type TGoal = {

};

export const createGoal = async (data) => {

    let response = await BackendFetch(PUBLIC_BACKEND_URL + '/goal', {
        method: 'POST',
        body: JSON.stringify(data),
    });


    return response.json();
}


export const getGoal = async (id: string) => {

}

export const getGoals = async (id: string) => {
    let response = await BackendFetch(PUBLIC_BACKEND_URL + '/goals');


    return response.json();
}
