
async function handleResponse(response, skipRedirect = false) {
    if (response.status === 401) {
        if(!skipRedirect) {
            window.dispatchEvent(new Event('unauthorized'));
            window.location.href = '/login.html';
        }
        return { error: 'Unauthorized' };
    }
    if (!response.ok) {
        console.error(`HTTP Error Status: ${response.status}`);
        throw new Error(`Server returned status ${response.status}`);
    }
    return response.json();
}

function getTimeZone(){
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

async function apiGet(endPoint, skipRedirect = false) {
    try {
        const response = await fetch(`${BASE_URL}${endPoint}`, {
            method: 'GET',
            credentials: 'include',
            headers: { 
                'Content-Type': 'application/json', 
                'time-zone': getTimeZone() 
            }
        });
        return await handleResponse(response, skipRedirect);
    } catch (err) {
        console.error("GET request failed:", err);
        return null; 
    }
}

async function apiPost(endPoint, data, skipRedirect = false) {
    try {
        const response = await fetch(`${BASE_URL}${endPoint}`, {
            method: 'POST',
            credentials: 'include',
            headers: { 
                'Content-Type': 'application/json', 
                'time-zone': getTimeZone() 
            },
            body: JSON.stringify(data)
        });
        return await handleResponse(response, skipRedirect);
    } catch (err) {
        console.error("POST request failed:", err);
        return null;
    }
}

async function apiDelete(endPoint, data, skipRedirect = false) {
    try {
        const response = await fetch(`${BASE_URL}${endPoint}`, {
            method: 'DELETE',
            credentials: 'include',
            headers: { 
                'Content-Type': 'application/json', 
                'time-zone': getTimeZone() 
            },
            body: JSON.stringify(data)
        });
        return await handleResponse(response, skipRedirect);
    } catch (err) {
        console.error("DELETE request failed:", err);
        return null;
    }
}

async function apiPost_ai(endPoint, data, prompt, skipRedirect = false) {
    try {
        const formData = new FormData();
        formData.append("photo", data);
        formData.append("prompt", prompt);

        const response = await fetch(`${BASE_URL}${endPoint}`, {
            method: "POST",
            credentials: "include",
            headers: { 
                'time-zone': getTimeZone() 
            },
            body: formData
        });
        return await handleResponse(response, skipRedirect);
    } catch (err) {
        console.error("AI POST request failed:", err);
        return null;
    }
}

export { apiPost, apiGet, apiDelete, apiPost_ai };