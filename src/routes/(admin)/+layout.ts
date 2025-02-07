import authStore from "$modules/auth/index.svelte.js";
import {redirect} from "@sveltejs/kit";

export const ssr = false;

export const load = async () => {
	console.log('server admin layout');

	console.log('user ', authStore.user);
	
	//middleware
	if (!authStore.isAuthorized()) {
		console.log('admin layout error goto login');
		
		throw redirect(301, `/login`)
	}

	return {

	};
};

