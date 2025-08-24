export const API_BASE = '/api';

export const handleResponse = async (response: Response, defaultErrorMessage: string) => {
    if (response.ok) {
        if (response.headers.get('Content-Length') === '0') {
            return Promise.resolve(null);
        }
        return response.json();
    }

    try {
        const errorData = await response.json();
        const message = errorData.message || defaultErrorMessage;

        // Dispatch a global event with the error message
        window.dispatchEvent(new CustomEvent('api-error', { detail: { message } }));

        throw new Error(message);
    } catch (e) {
        // Fallback for non-json errors
        window.dispatchEvent(new CustomEvent('api-error', { detail: { message: defaultErrorMessage } }));
        throw new Error(defaultErrorMessage);
    }
};

export const getCsrfToken = (): string => {
    const csrfMeta = document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]');
    return csrfMeta?.getAttribute('content') ?? '';
};

export const createAuthenticatedRequest = (method: string, body?: any) => ({
    method,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-CSRF-TOKEN': getCsrfToken(),
    },
    ...(body && { body: JSON.stringify(body) }),
});
