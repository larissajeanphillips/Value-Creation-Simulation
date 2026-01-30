# restart

Shut down and restart the dev environment.

This command will be available in chat with /restart

When triggered, execute the following steps:

1. **Stop the running container**:
   ```bash
   docker stop agent-chat-dev
   ```

2. **Restart with the Docker dev script**:
   ```bash
   cd deployer-apps/citizen-dev5/src && ./scripts/docker-dev.sh
   ```

3. **Inform the user** that the app will be available at http://localhost:3000

If you need to rebuild (e.g., after UI changes), use:
```bash
./scripts/docker-dev.sh --build
```
