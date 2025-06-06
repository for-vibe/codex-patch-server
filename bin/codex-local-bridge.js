#!/usr/bin/env node
const { startServer } = require('../src/server');
const { parseCliArgs } = require('../src/cli');

const { port, subdomain, secretKey } = parseCliArgs(process.argv);

if (!secretKey) {
  console.error('Secret key is required. Provide it via --secret option or .env file.');
  process.exit(1);
}

startServer({ port, subdomain, secretKey });
