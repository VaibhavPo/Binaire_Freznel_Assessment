import fs from 'fs';

const TokenKey = 'token-key';
const TOKEN_FILE = './token.json';

function setToken(token) {
  try {
    fs.writeFileSync(TOKEN_FILE, JSON.stringify({ [TokenKey]: token }, null, 2));
  } catch (error) {
    console.error('Error saving token to storage', error);
  }
}

function getToken() {
  try {
    if (!fs.existsSync(TOKEN_FILE)) return null;
    const data = fs.readFileSync(TOKEN_FILE, 'utf8');
    const parsed = JSON.parse(data);
    return parsed[TokenKey] || null;
  } catch (error) {
    console.error('Error retrieving token from storage', error);
    return null;
  }
}

export { setToken, getToken };