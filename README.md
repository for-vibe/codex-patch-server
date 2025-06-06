# Codex Local Bridge

A CLI tool that runs a patch application server and exposes it via [localtunnel](https://github.com/localtunnel/localtunnel).

## Installation

```bash
npm install -g codex-local-bridge
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

## CI/CD

This project uses GitHub Actions to run tests and publish the package to the
GitHub Package Registry automatically. The workflow triggers on pushes to the
`main` branch and ensures that the package is always built and released after
tests succeed.

