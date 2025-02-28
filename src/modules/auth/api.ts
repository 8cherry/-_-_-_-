import {PUBLIC_BACKEND_URL as backendUrl} from "$env/static/public";


let users = [
    {
        email: 'ar@gmail.com',
        password: '123',
    }
];

const getAuthToken = async (data: {email: string; password: string}) => {
    const response = await fetch(backendUrl + "/login", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
        },
    })

    if (response.status == 404) {
        throw "Пользователь не существует";
    }

    if (response.status == 400) {
        throw "Неверный пароль";
    }


    return response.json();
}


export {
    getAuthToken
}
