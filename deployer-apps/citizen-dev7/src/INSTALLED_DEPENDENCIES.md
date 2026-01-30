# Installed Dependencies

Complete list of everything installed in the Docker image.

## Python Backend Dependencies

### Core Framework
- **fastapi** - Modern web framework for building APIs (installed in Dockerfile)
- **uvicorn[standard]** - ASGI server for FastAPI (installed in Dockerfile)
- **python-dotenv** - Load environment variables from .env file (installed in Dockerfile)

### AI/LLM Support (Agent Framework)
- **anthropic==0.40.0** - Anthropic/Claude API client
- **openai==1.52.0** - OpenAI API client
- **httpx==0.27.2** - HTTP client for API requests

### Data Processing
- **pandas==2.1.3** - Data manipulation and analysis (Excel, CSV, etc.)
- **openpyxl==3.1.2** - Read/write Excel .xlsx files
- **pypdf==5.1.0** - PDF processing

### Data Validation & Configuration
- **pydantic==2.9.2** - Data validation using Python type annotations
- **PyYAML==6.0.2** - YAML file parsing

### CLI & Utilities
- **typer==0.12.5** - Modern CLI framework
- **rich==13.8.1** - Rich text and beautiful formatting in terminal
- **click==8.1.7** - CLI creation toolkit

### HTTP & Networking
- **requests==2.31.0** - HTTP library for making requests

## React Frontend Dependencies

### Core Framework
- **react==^18.3.1** - React library
- **react-dom==^18.3.1** - React DOM rendering

### UI Components & Icons
- **react-markdown==^9.0.1** - Markdown rendering for React
- **lucide-react==^0.468.0** - Icon library

### Build Tools (Dev Dependencies)
- **vite==^6.0.1** - Fast build tool and dev server
- **@vitejs/plugin-react==^4.3.4** - Vite plugin for React
- **typescript==^5.6.3** - TypeScript compiler
- **@types/react==^18.3.12** - TypeScript types for React
- **@types/react-dom==^18.3.1** - TypeScript types for React DOM

### Styling
- **tailwindcss==^3.4.15** - Utility-first CSS framework
- **postcss==^8.4.49** - CSS post-processor
- **autoprefixer==^10.4.20** - CSS vendor prefixer

### Code Quality
- **eslint==^9.15.0** - JavaScript/TypeScript linter
- **eslint-plugin-react-hooks==^5.0.0** - React Hooks linting rules
- **eslint-plugin-react-refresh==^0.4.14** - React Refresh linting

## System Dependencies (Base Images)

### Stage 1: UI Builder
- **Node.js 22.12.0** (Alpine Linux 3.21)
  - npm (package manager)
  - All Node.js runtime dependencies

### Stage 2: Python Builder
- **Python 3.12.8** (Debian Bookworm)
  - **gcc** - C compiler (for building Python packages with C extensions)
  - pip (Python package manager)

### Stage 3: Runtime
- **Python 3.12.8** (Debian Bookworm - slim)
- **curl** - HTTP client (for health checks)

## Runtime Environment

### Directories Created
- `/app/data/outputs` - For agent workflow outputs
- `/app/data/excel` - For Excel file storage
- `/app/ui/dist` - Built React UI static files

### Environment Variables
- `PYTHONUNBUFFERED=1` - Python output is not buffered
- `PYTHONDONTWRITEBYTECODE=1` - Don't create .pyc files
- `PYTHONPATH=/app` - Python module search path
- `PATH=/home/appuser/.local/bin:$PATH` - User-installed Python packages

### User & Security
- Non-root user: `appuser` (UID 1000)
- All files owned by `appuser` for security

## What Gets Built

### React UI (Stage 1)
- All npm packages installed
- React app compiled to static files (`ui/dist/`)
- Optimized production build

### Python Backend (Stage 2)
- All Python packages installed to `/root/.local`
- Compiled extensions built
- Dependencies cached for faster rebuilds

### Final Image (Stage 3)
- Only runtime dependencies (no build tools)
- Pre-built React UI static files
- Python packages ready to use
- Application code copied

## Total Package Count

- **Python packages**: ~15 (including transitive dependencies)
- **Node.js packages**: ~30+ (including transitive dependencies)
- **System packages**: Minimal (curl, gcc only during build)

## Key Capabilities Enabled

✅ **Web Framework**: FastAPI for REST APIs  
✅ **AI/LLM**: OpenAI, Anthropic clients  
✅ **Data Processing**: Excel (pandas, openpyxl), PDF (pypdf)  
✅ **Frontend**: React 18 with TypeScript  
✅ **Styling**: Tailwind CSS  
✅ **Markdown**: Rendering support  
✅ **CLI Tools**: Rich terminal output, CLI apps  
✅ **Configuration**: YAML, environment variables  

## Adding New Dependencies

### Python Packages
Add to `requirements.txt`:
```python
package-name==version
```

Then rebuild:
```bash
./scripts/docker-dev.sh --build
```

### Node.js Packages
Add to `ui/package.json`:
```json
"dependencies": {
  "package-name": "^version"
}
```

Then rebuild:
```bash
./scripts/docker-dev.sh --build
```

Or install locally (if you have Node.js):
```bash
cd ui
npm install package-name
```

## Notes

- **Build tools** (gcc, npm) are only in build stages, not final image
- **Final image** is optimized for size - only runtime dependencies
- **Hot reload** works for Python files (no rebuild needed)
- **UI changes** require rebuild or running UI separately for faster iteration
