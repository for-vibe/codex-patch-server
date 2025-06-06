# Codex Local Bridge

[![Package Version](https://img.shields.io/github/package-json/v/for-vibe/codex-local-bridge?label=version)](https://github.com/orgs/for-vibe/packages/npm/codex-local-bridge)


A CLI tool that runs a patch application server and exposes it via [localtunnel](https://github.com/localtunnel/localtunnel).

## Installation

```bash
npm install -g @for-vibe/codex-local-bridge
```

## Usage

```bash
codex-local-bridge --port 3030 --subdomain my-sub --secret myKey
```

Arguments:

- `--port`, `-p` – server port (default `3030`).
- `--subdomain`, `-s` – optional localtunnel subdomain.
- `--secret`, `-k` – secret key used for patch requests.

The tool uses `.env` in the current directory if present. Variables `PORT` and `SECRET_KEY` can provide defaults for the corresponding CLI options.

## Endpoint

The server exposes `POST /apply-patch` expecting form-data with fields:

- `commit` – git commit hash or branch.
- `patchFile` – patch file to apply.

Provide the secret key in the `X-Secret-Key` header.

### Example patch request

Generate a patch and send it to the running server:

```bash
git diff > change.patch
curl -X POST http://localhost:3030/apply-patch \
  -H 'X-Secret-Key: myKey' \
  -F commit=main \
  -F patchFile=@change.patch
```

Replace `main` with the commit or branch to check out before applying the patch.

After the patch has been processed, the repository is reset to `HEAD` so no
changes remain in the working directory.


