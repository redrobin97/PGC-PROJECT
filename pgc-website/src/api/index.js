const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;

async function initializeGameData() {
  try {
    const res = await fetch(`http://localhost:3000/21`);
    const json = await res.json();
    return json;
  } catch (err) {
    throw err;
  }
}

export { initializeGameData };
