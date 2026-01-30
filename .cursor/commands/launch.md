# launch

Launch the webapp locally using Docker.

This command will be available in chat with /launch

When triggered, execute the following steps:

1. **Check if Docker is running** by running `docker info`

2. **Navigate to the app source directory**:
   ```bash
   cd deployer-apps/citizen-dev5/src
   ```

3. **Run the Docker development script**:
   ```bash
   ./scripts/docker-dev.sh
   ```

4. **Inform the user** that the app will be available at http://localhost:3000

If Docker is not running, instruct the user to start Docker Desktop first.

If the script fails, suggest running with `--build` flag:
```bash
./scripts/docker-dev.sh --build
```
