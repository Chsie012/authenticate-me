import Cookies from 'js-cookie';

// Custom fetch function that includes CSRF protection
export async function csrfFetch(url, options = {}) {
  // Set the HTTP method to 'GET' if no method is provided
  options.method = options.method || 'GET';

  // Ensure that options.headers is not undefined by defaulting to an empty object if not set
  options.headers = options.headers || {};

  // If the request method is anything other than 'GET', include the CSRF token in the request
  if (options.method.toUpperCase() !== 'GET') {
    // Set the Content-Type to 'application/json' if it's not already set
    options.headers['Content-Type'] =
      options.headers['Content-Type'] || 'application/json';

    // Extract the CSRF token from the cookie
    const csrfToken = Cookies.get('XSRF-TOKEN');

    // If the CSRF token exists, add it to the request headers
    if (csrfToken) {
      options.headers['XSRF-Token'] = csrfToken;
    } else {
      // Log an error if no CSRF token is found (helpful for debugging)
      console.error("No XSRF-TOKEN cookie found");
    }
  }

  // Perform the fetch request with the provided URL and options
  const res = await window.fetch(url, options);

  // If the response status code is 400 or above, throw the response to handle errors
  if (res.status >= 400) throw res;

  // If the status code is below 400, return the response to proceed with the request
  return res;
}

// Function to restore the CSRF token by calling the backend in development
export function restoreCSRF() {
  // Call the /api/csrf/restore route to restore the CSRF token in development mode
  return csrfFetch('/api/csrf/restore');
}
