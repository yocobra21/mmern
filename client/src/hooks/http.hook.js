import React from 'react';

export const useHttp = () => {
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);

    const request = React.useCallback(async (url, method = 'GET', body = null, headers = {}) => {
        setLoading(true);
        try {
            if (body) {
                body = JSON.stringify(body);
                headers['Content-Type'] = 'application/json';
            }
            const response = await fetch(url, { method, body, headers });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'fetch err');
            }
            setLoading(false);
            return data;
        } catch (err) {
            setLoading(false);
            setError(err.message);
            throw err;
        }

    }, []);

    const clearError = React.useCallback(() => setError(null), []);

    return { loading, error, request, clearError };
}