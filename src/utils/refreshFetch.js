import 'dotenv/config';
const baseURL = process.env.baseURL;

async function fetchData(endpoint, token) {
const response = await fetch(`${baseURL}${endpoint}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
}

async function fetchAllData(token) {
  const endpoints = [
    "/api/cpu",
    "/api/gpu",
    "/api/memory",
    "/api/disk",
    "/api/network",
    "/api/battery",
    "/api/processes",
  ];

  const results = await Promise.all(
    endpoints.map(endpoint => fetchData(endpoint, token))
  );

  return results;
}

export { fetchData, fetchAllData };