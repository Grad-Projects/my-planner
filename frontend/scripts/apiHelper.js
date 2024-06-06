export class ApiHelper {
    constructor(baseURL) {
        this.baseURL = baseURL;
    }

    async post(endpoint, data) {
        const url = `${this.baseURL}/${endpoint}`;
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
            body: JSON.stringify(data)
        };

        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error('There was a problem with the fetch operation');
        }
    }

    async get(endpoint) {
        const url = `${this.baseURL}${endpoint}`;
        const options = {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
        }

        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error('There was a problem with the fetch operation');
        }
    }

    async patch(endpoint, data) {
        const url = `${this.baseURL}${endpoint}`;
        const options = {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
            body: JSON.stringify(data)
        };

        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error('There was a problem with the fetch operation');
        }
    }

    async toggle(endpoint) {
        const url = `${this.baseURL}${endpoint}`;
        const options = {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
        };
    
        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error('There was a problem with the fetch operation');
        }
    }
}