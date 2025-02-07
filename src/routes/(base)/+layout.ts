import {redirect} from "@sveltejs/kit";
import authStore from "$modules/auth/index.svelte.ts";

export const ssr = false;

export const load = async () => {

    if (document.cookie) {
        console.log(document.cookie);
        
    }
    console.log('is auth ', authStore.isAuthorized());

    if (authStore.isAuthorized()) {
        throw redirect(301, `/`)
    }
}
