const express = require('express');
const multer = require('multer');
const simpleGit = require('simple-git');
const fs = require('fs');
const path = require('path');
const localtunnel = require('localtunnel');

/**
 * Starts the patch application server.
 * @param {object} options
 * @param {number} options.port The port to run the server on.
 * @param {string} options.secretKey Secret key to authorize requests.
 * @param {string} [options.subdomain] Optional localtunnel subdomain.
 */
async function startServer({ port, secretKey, subdomain }) {
  const app = express();
  const upload = multer({ dest: path.join(process.cwd(), 'patches') });
  const git = simpleGit(process.cwd());

  app.post('/apply-patch', upload.single('patchFile'), async (req, res) => {
    const providedKey = req.headers['x-secret-key'];
    if (providedKey !== secretKey) {
      return res.status(403).json({ error: 'Forbidden: Invalid secret key' });
    }

    const { commit } = req.body;
    const patchPath = req.file?.path;

    if (!commit || !patchPath) {
      return res.status(400).json({ error: 'Missing commit or patch file' });
    }

    try {
      await git.checkout(commit);
      const patchContent = fs.readFileSync(patchPath, 'utf-8');
      await git.raw(['apply', '--whitespace=fix'], patchContent);
      res.json({ success: true, message: `Checked out to ${commit} and patch applied.` });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to apply patch', details: err.message });
    } finally {
      fs.unlink(patchPath, () => {});
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
