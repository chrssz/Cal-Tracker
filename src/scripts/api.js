const BASE_URL = 'http://localhost:3000';

async function apiGet(endPoint){
    const response = await fetch(`${BASE_URL}${endPoint}`, {
        credentials: 'include'
    });

    if(response.status == 401) {
        window.location.href = '/login.html';
        return;
    }

    return response.json();
}

async function apiPost(endPoint, data){
    const response = await fetch(`${BASE_URL}${endPoint}`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        credentials: 'include',
        body: JSON.stringify(data)
    });

    if(response.status == 401) {
        window.location.href = '/login.html';
        return;
    }
    
    return response.json();

}

async function apiDelete(endPoint, data) {
    const response = await fetch(`${BASE_URL}${endPoint}`, {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'},
        credentials: 'include',
        body: JSON.stringify(data)
    });

    if(response.status == 401) {
        window.location.href = '/login.html';
        return;
    }
    
    return response.json();
}

export { apiPost, apiGet, apiDelete }