export class ApiHelper {
    constructor(baseURL) {
        this.baseURL = baseURL;
    }

    async post(endpoint, data) {
        const url = `${this.baseURL}${endpoint}`;
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
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
            console.error('There was a problem with the fetch operation:', error);
            throw error;
        }
    }

    async get(endpoint) {
        const url = `${this.baseURL}${endpoint}`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
            throw error;
        }
    }

    async patch(endpoint, data) {
        const url = `${this.baseURL}${endpoint}`;
        const options = {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
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
            console.error('There was a problem with the fetch operation:', error);
            throw error;
        }
    }

    async toggle(endpoint) {
        const url = `${this.baseURL}${endpoint}`;
        const options = {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            }
        };
    
        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
            throw error;
        }
    }
}