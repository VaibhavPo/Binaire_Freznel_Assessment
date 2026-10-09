import {fetchAllData} from './utils/refreshFetch.js';
import {authenticatePage} from './pages/authenticatePage.js';
import React from 'react';
import {getToken} from './utils/tokenManager.js';
import { App } from './App.jsx';
import { render } from 'ink';

// Guarantee clean exit on Ctrl+C (SIGINT)
process.on('SIGINT', () => {
  process.exit(0);
});

const user = await authenticatePage();
if (user) {
  const token = getToken();
  console.clear();
  // Unpause stdin which was paused by @clack/prompts when closing readline
  process.stdin.resume();
  render(<App token={token} />);
}