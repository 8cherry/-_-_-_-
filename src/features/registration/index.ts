import {PUBLIC_BACKEND_URL as backendUrl} from "$env/static/public";
import {registerUser} from "./api";
import authStore from '$modules/auth/index.svelte';


const doRegistrate = async (data: {email: string; name: string; password: string}) => {
    const result = await registerUser(data);


    console.log('token res ', result);
    
    authStore.load(result.token);

    console.log('is auth ', authStore.isAuthorized());
}



export {
    doRegistrate
}
