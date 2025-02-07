import authStore  from '$modules/auth/index.svelte';

export const ssr = false;

export async function load({cookies}) {
    console.log('DEBUG PRINT: load auth session', cookies.get('session'));

    let session = cookies.get('session');
    
    // if (session){
    //     console.log('authorize user');
        
    //     authStore.load(cookies.get('session'));
    // }

    return {
        session:  session || null
    }
}
