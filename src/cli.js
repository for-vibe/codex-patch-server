const path = require('path');
const dotenv = require('dotenv');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

/**
 * Parses command line arguments.
 * @param {string[]} argv Process arguments.
 * @returns {{port:number, subdomain:string|undefined, secretKey:string|undefined}}
 */
function parseCliArgs(argv) {
  dotenv.config({ path: path.resolve(process.cwd(), '.env') });
  const args = yargs(hideBin(argv))
    .option('port', {
      alias: 'p',
      type: 'number',
      default: process.env.PORT ? Number(process.env.PORT) : 3030,
      description: 'Port to run the server'
    })
    .option('subdomain', {
      alias: 's',
      type: 'string',
      description: 'Localtunnel subdomain'
    })
    .option('secret', {
      alias: 'k',
      type: 'string',
      default: process.env.SECRET_KEY,
      description: 'Secret key to authorize patch requests'
    })
    .help()
    .parse();
  return { port: args.port, subdomain: args.subdomain, secretKey: args.secret };
}

module.exports = { parseCliArgs };
