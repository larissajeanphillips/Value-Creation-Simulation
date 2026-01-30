# Building a Command Center-Style App

Comparison of dependencies needed to build a Command Center-style application (like `pa-demand-analysis`) using the citizen-dev7 Docker-first setup.

## Key Differences

The Command Center app uses:
- **Backend**: Node.js/Express/TypeScript (vs Python/FastAPI in citizen-dev7)
- **Database**: PostgreSQL (same - but needs client library)
- **Frontend**: More advanced UI libraries (Radix UI, TanStack Table, Recharts, etc.)

## What You'd Need to Add

### Option 1: Keep Python/FastAPI Backend (Recommended)

**Advantage**: Works with current Docker setup, no major changes needed.

#### Frontend Dependencies (Add to `ui/package.json`)

```json
{
  "dependencies": {
    // UI Component Libraries (Radix UI)
    "@radix-ui/react-alert-dialog": "^1.1.15",
    "@radix-ui/react-checkbox": "^1.3.3",
    "@radix-ui/react-collapsible": "^1.1.12",
    "@radix-ui/react-dialog": "^1.1.15",
    "@radix-ui/react-dropdown-menu": "^2.1.16",
    "@radix-ui/react-label": "^2.1.8",
    "@radix-ui/react-popover": "^1.1.15",
    "@radix-ui/react-radio-group": "^1.3.8",
    "@radix-ui/react-select": "^2.2.6",
    "@radix-ui/react-separator": "^1.1.8",
    "@radix-ui/react-slot": "^1.2.4",
    "@radix-ui/react-switch": "^1.2.6",
    "@radix-ui/react-tabs": "^1.1.13",
    "@radix-ui/react-toast": "^1.2.15",
    "@radix-ui/react-tooltip": "^1.2.8",
    
    // Data Tables & Virtualization
    "@tanstack/react-table": "^8.21.3",
    "@tanstack/react-virtual": "^3.13.14",
    
    // Drag and Drop
    "@dnd-kit/core": "^6.3.1",
    "@dnd-kit/sortable": "^10.0.0",
    "@dnd-kit/utilities": "^3.2.2",
    
    // Charts & Visualization
    "recharts": "^2.11.0",
    
    // Excel/PDF Generation
    "exceljs": "^4.4.0",
    "jspdf": "^3.0.4",
    "html2canvas": "^1.4.1",
    "pdfmake": "^0.3.0",
    
    // Utilities
    "date-fns": "^4.1.0",
    "canvas-confetti": "^1.9.4",
    "sonner": "^2.0.7",
    "react-resizable-panels": "^2.0.22",
    
    // Already have these:
    // "react", "react-dom", "zustand", "lucide-react", "clsx", "tailwind-merge"
  }
}
```

#### Python Backend Dependencies (Add to `requirements.txt`)

```python
# Database
psycopg2-binary==2.9.9  # PostgreSQL client

# Already have:
# pandas, openpyxl (for Excel)
# fastapi, uvicorn (web framework)
```

#### What You'd Need to Implement

1. **PostgreSQL Connection** in `api.py`:
```python
import psycopg2
from psycopg2.pool import SimpleConnectionPool

# Connection pool
pool = SimpleConnectionPool(
    minconn=1,
    maxconn=10,
    host=os.getenv("DB_HOST"),
    database=os.getenv("DB_NAME"),
    user=os.getenv("DB_USER"),
    password=os.getenv("DB_PASSWORD")
)
```

2. **API Endpoints** for:
   - Data queries (supply/demand/inventory)
   - Excel exports
   - PDF generation (can use Python libraries like `reportlab` or `weasyprint`)

3. **Frontend Components**:
   - Data tables with sorting/filtering
   - Charts (Recharts)
   - Drag-and-drop interfaces
   - Export functionality

### Option 2: Switch to Node.js/Express Backend

**Requires**: Major Dockerfile changes to support Node.js backend.

#### Changes Needed

1. **Dockerfile**: Add Node.js backend build stage
2. **Backend**: Rewrite in Node.js/Express/TypeScript
3. **Dependencies**: Add Node.js packages to separate `backend/package.json`

**Not recommended** unless you specifically need Node.js features, as it requires significant restructuring.

## Dependency Comparison

| Feature | Command Center | citizen-dev7 (Current) | Add? |
|---------|---------------|----------------------|------|
| **Frontend Framework** | React 18 | React 18 | ✅ Same |
| **Build Tool** | Vite | Vite | ✅ Same |
| **UI Components** | Radix UI | Basic | ⚠️ Add Radix UI |
| **Data Tables** | TanStack Table | None | ⚠️ Add TanStack Table |
| **Charts** | Recharts | None | ⚠️ Add Recharts |
| **Excel Export** | ExcelJS (frontend) | pandas (backend) | ⚠️ Add ExcelJS or use backend |
| **PDF Export** | jspdf/pdfmake | None | ⚠️ Add or use backend |
| **Drag & Drop** | @dnd-kit | None | ⚠️ Add @dnd-kit |
| **Backend** | Node.js/Express | Python/FastAPI | ⚠️ Keep FastAPI (easier) |
| **Database** | PostgreSQL | None (yet) | ⚠️ Add psycopg2 |
| **State Management** | Zustand | Zustand (if needed) | ✅ Same |

## Recommended Approach

### Keep Python/FastAPI Backend

**Why:**
- ✅ Works with current Docker setup
- ✅ No major restructuring needed
- ✅ Python is great for data processing (pandas, Excel, etc.)
- ✅ FastAPI is modern and fast

**What to add:**

1. **Frontend libraries** (all install via npm in Docker):
   - Radix UI components
   - TanStack Table & Virtual
   - Recharts
   - ExcelJS (or use backend)
   - Drag-and-drop libraries

2. **Backend libraries** (add to `requirements.txt`):
   - `psycopg2-binary` for PostgreSQL
   - `reportlab` or `weasyprint` for PDF (optional)

3. **Database setup**:
   - Add PostgreSQL connection code
   - Create API endpoints for data queries

## Installation Steps

### 1. Add Frontend Dependencies

```bash
cd deployer-apps/citizen-dev7/src/ui

# Add all Radix UI components
npm install @radix-ui/react-alert-dialog @radix-ui/react-checkbox \
  @radix-ui/react-collapsible @radix-ui/react-dialog \
  @radix-ui/react-dropdown-menu @radix-ui/react-label \
  @radix-ui/react-popover @radix-ui/react-radio-group \
  @radix-ui/react-select @radix-ui/react-separator \
  @radix-ui/react-slot @radix-ui/react-switch \
  @radix-ui/react-tabs @radix-ui/react-toast \
  @radix-ui/react-tooltip

# Add data table & virtualization
npm install @tanstack/react-table @tanstack/react-virtual

# Add drag and drop
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities

# Add charts
npm install recharts

# Add Excel/PDF
npm install exceljs jspdf html2canvas pdfmake

# Add utilities
npm install date-fns canvas-confetti sonner react-resizable-panels
```

### 2. Add Backend Dependencies

Add to `requirements.txt`:
```python
psycopg2-binary==2.9.9
reportlab==4.0.9  # Optional: for PDF generation
```

### 3. Rebuild Docker Image

```bash
cd deployer-apps/citizen-dev7/src
./scripts/docker-dev.sh --build
```

## Summary

**To build a Command Center-style app, you'd need to add:**

✅ **Frontend** (all install in Docker, no local Node.js needed):
- Radix UI components (~15 packages)
- TanStack Table & Virtual
- Recharts
- ExcelJS, jspdf, pdfmake
- Drag-and-drop libraries
- Date utilities, toast notifications

✅ **Backend** (add to requirements.txt):
- `psycopg2-binary` for PostgreSQL

✅ **Keep current setup**:
- Python/FastAPI backend (works great!)
- Docker-first development
- React + Vite frontend

**Total new dependencies**: ~25-30 npm packages + 1-2 Python packages

**All install automatically in Docker** - no local Node.js or Python needed! 🎉
