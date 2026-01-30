# commit

Commit changes and push to the repository.

This command will be available in chat with /commit

When triggered, execute the following steps:

1. **Check current status**:
   ```bash
   git status
   git diff --staged
   git diff
   git log --oneline -5
   ```

2. **Review the changes** and determine what should be committed

3. **Stage relevant files**:
   ```bash
   git add <files>
   ```

4. **Create a commit** using conventional commit format:
   - `feat:` for new features
   - `fix:` for bug fixes
   - `chore:` for maintenance
   - `docs:` for documentation
   - `refactor:` for code restructuring

5. **Push to remote**:
   ```bash
   git push
   ```

6. **Confirm success** to the user
