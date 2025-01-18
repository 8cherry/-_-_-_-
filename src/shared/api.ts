import authStore from '$modules/auth/index.svelte'



export function BackendFetch(url: string, options: RequestInit & Record<string, any> = {}) {
    if (!options.headers)
        options.headers = {}

    options.headers['Authorization'] = 'bearer ' + authStore.getToken()
    options.headers['content-type'] = 'application/json'


    return fetch(url, options)
}
