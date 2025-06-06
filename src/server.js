const express = require('express');
const multer = require('multer');
const simpleGit = require('simple-git');
const fs = require('fs');
const path = require('path');
const localtunnel = require('localtunnel');
const morgan = require('morgan');

/**
 * Starts the patch application server.
 * @param {object} options
 * @param {number} options.port The port to run the server on.
 * @param {string} options.secretKey Secret key to authorize requests.
 * @param {string} [options.subdomain] Optional localtunnel subdomain.
 */
async function startServer({ port, secretKey, subdomain }) {
  console.debug('Starting server', { port, subdomain });
  const app = express();
  app.use(morgan('combined'));
  const patchesDir = path.join(process.cwd(), 'patches');
  const storage = multer.diskStorage({
    destination(req, file, cb) {
      fs.mkdirSync(patchesDir, { recursive: true });
      cb(null, patchesDir);
    },
    filename(req, file, cb) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const ext = path.extname(file.originalname) || '.patch';
      const base = path.basename(file.originalname, ext);
      cb(null, `${base}-${timestamp}${ext}`);
    }
  });
  const upload = multer({ storage });
  const git = simpleGit(process.cwd());

  app.post('/apply-patch', upload.single('patchFile'), async (req, res) => {
    console.debug('Received apply-patch request');
    const providedKey = req.headers['x-secret-key'];
    if (providedKey !== secretKey) {
      console.debug('Rejected request due to invalid secret key');
      return res.status(403).json({ error: 'Forbidden: Invalid secret key' });
    }

    const { commit } = req.body;
    const patchPath = req.file?.path;

    if (!commit || !patchPath) {
      console.debug('Missing commit or patch file', { commit, patchPath });
      return res.status(400).json({ error: 'Missing commit or patch file' });
    }

    try {
      console.debug(`Checking out ${commit}`);
      await git.checkout(commit);
      const patchContent = fs.readFileSync(patchPath, 'utf-8');
      console.debug('Patch content:\n' + patchContent);

      let alreadyApplied = false;
      try {
        await git.raw(['apply', '--reverse', '--check', patchPath]);
        alreadyApplied = true;
      } catch (_) {
        // ignore, patch not applied yet
      }

      if (alreadyApplied) {
        console.debug('Patch already applied, skipping');
        return res.json({ success: true, message: 'Patch already applied. Skipped.' });
      }

      console.debug(`Applying patch ${patchPath}`);
      await git.raw(['apply', '--whitespace=fix', patchPath]);
      console.debug('Patch applied successfully');
      res.json({ success: true, message: `Checked out to ${commit} and patch applied.` });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to apply patch', details: err.message });
    } finally {
      console.debug(`Patch file saved at ${patchPath}`);
    }
  });

  app.listen(port, async () => {
    console.log(`codex-local-bridge running on localhost:${port}`);
    try {
      const tunnel = await localtunnel({ port, subdomain });
      console.log(`Public URL: ${tunnel.url}`);
    } catch (err) {
      console.error(`Failed to open tunnel: ${err.message}`);
    }
  });
}

module.exports = { startServer };
