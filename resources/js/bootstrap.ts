/**
 * This file is for setting up and configuring your application's
 * JavaScript dependencies, such as Axios for HTTP requests.
 */

import axios from 'axios';

// We are telling TypeScript that we are adding 'axios' to the global window object.
// This is done more formally in a `global.d.ts` file for project-wide type safety.
declare global {
    interface Window {
        axios: typeof axios;
    }
}

window.axios = axios;

/**
 * We'll configure axios to automatically send the CSRF token as a header.
 * This is a common security measure in Laravel applications.
 */
window.axios.defaults.headers.common['X-Requested-with'] = 'XMLHttpRequest';

// You could also configure your base URL here if you have a dedicated API subdomain
// window.axios.defaults.baseURL = 'http://api.your-app.com';


/**
 * Echo exposes an expressive API for subscribing to channels and listening
 * for events that are broadcast by Laravel. Echo and event broadcasting
 * allows your team to easily build robust real-time web applications.
 */

// import Echo from 'laravel-echo';
// import Pusher from 'pusher-js';

// declare global {
//   interface Window {
//     Pusher: typeof Pusher;
//     Echo: Echo;
//   }
// }

// window.Pusher = Pusher;

// window.Echo = new Echo({
//     broadcaster: 'pusher',
//     key: import.meta.env.VITE_PUSHER_APP_KEY,
//     cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER ?? 'mt1',
//     wsHost: import.meta.env.VITE_PUSHER_HOST ?? `ws-${import.meta.env.VITE_PUSHER_APP_CLUSTER}.pusher.com`,
//     wsPort: import.meta.env.VITE_PUSHER_PORT ?? 80,
//     wssPort: import.meta.env.VITE_PUSHER_PORT ?? 443,
//     forceTLS: (import.meta.env.VITE_PUSHER_SCHEME ?? 'https') === 'https',
//     enabledTransports: ['ws', 'wss'],
// });


// This line is crucial for TypeScript. It explicitly tells the compiler that
// this file is a module, which resolves import/export-related errors,
// even if the file itself doesn't export any values.
export {};
