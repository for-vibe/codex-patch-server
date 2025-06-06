### ✅ Best Practices

- Use **clean and modular code** – follow the SOLID principles where applicable.
- Write **descriptive, self-documenting code** – minimize the need for comments by making your code expressive.
- Avoid duplication – **DRY** (Don't Repeat Yourself).
- Keep functions and files short and focused on a single responsibility.
- Handle errors and edge cases gracefully.
- Use **meaningful variable and function names** in **English only**.

---

### 🧪 Testing

- Cover your code with **unit and integration tests**.
- Strive for high test coverage, especially for critical logic.
- Use mocks and stubs when appropriate to isolate logic.
- All tests should be **written in English**.

---

### 🔤 Language

- All code, comments, documentation, and commit messages **must be in English**.
- Exceptions may apply to end-user facing text, if needed for localization.

---

### 📝 Commit Message Format

- Use **conventional commits** format.

### 🏆 Patch Workflow Example

1. Create a patch file with `git diff > changes.patch`.
2. Send the patch to the running server:

```bash
curl -X POST http://localhost:3030/apply-patch \
  -H 'X-Secret-Key: <your-key>' \
  -F commit=<commit-or-branch> \
  -F patchFile=@changes.patch
```

Replace `<commit-or-branch>` with the commit hash or branch name to check out before applying the patch.
