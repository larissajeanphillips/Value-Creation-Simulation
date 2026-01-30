# Building a New Webapp with Excel Data

This guide shows you how to build a brand new webapp that reads Excel files from a folder and displays them in a custom UI - **all without installing Node.js, Python, or build tools locally!**

## Quick Answer: Can They Launch It?

**YES!** With Docker-first development:

```bash
cd deployer-apps/citizen-dev7/src
./scripts/docker-dev.sh
```

**That's it!** The Docker setup:
- ✅ Builds the React UI (no Node.js needed locally)
- ✅ Runs the Python backend (no Python needed locally)
- ✅ Reads Excel files from any folder
- ✅ Serves everything on http://localhost:3000

## Step-by-Step: Building Your Excel Webapp

### Step 1: Add Excel Reading Library

Add `pandas` and `openpyxl` to `requirements.txt`:

```python
# requirements.txt
fastapi==0.104.1
uvicorn[standard]==0.24.0
python-dotenv==1.0.0
pydantic==2.5.0
pandas==2.1.3
openpyxl==3.1.2  # For reading .xlsx files
```

### Step 2: Create Data Folder

Create a folder for your Excel files:

```bash
mkdir -p data/excel
# Put your Excel files here: data/excel/sales.xlsx, data/excel/inventory.xlsx, etc.
```

### Step 3: Replace `api.py` with Your Excel Reader

Replace the agent framework code with your Excel webapp:

```python
"""
FastAPI backend for Excel Data Webapp.

Reads Excel files from data/excel/ folder and serves them via API.
"""

from __future__ import annotations

import os
from pathlib import Path
from typing import List, Dict, Any

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
import pandas as pd

# Load environment variables
load_dotenv()

# Project root
PROJECT_ROOT = Path(__file__).parent
EXCEL_FOLDER = PROJECT_ROOT / "data" / "excel"
UI_DIST_PATH = PROJECT_ROOT / "ui" / "dist"

app = FastAPI(
    title="Excel Data Webapp",
    description="Webapp for viewing Excel data",
    version="1.0.0",
)

# CORS for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure Excel folder exists
EXCEL_FOLDER.mkdir(parents=True, exist_ok=True)


# =============================================================================
# API Models
# =============================================================================

class ExcelFileInfo(BaseModel):
    """Information about an Excel file."""
    filename: str
    sheets: List[str]
    row_count: int


class ExcelDataResponse(BaseModel):
    """Response with Excel data."""
    filename: str
    sheet: str
    data: List[Dict[str, Any]]
    columns: List[str]
    row_count: int


# =============================================================================
# API Endpoints
# =============================================================================

@app.get("/api/files", response_model=List[ExcelFileInfo])
async def list_excel_files():
    """
    List all Excel files in the data/excel folder.
    """
    excel_files = []
    
    if not EXCEL_FOLDER.exists():
        return []
    
    for file_path in EXCEL_FOLDER.glob("*.xlsx"):
        try:
            # Read Excel to get sheet names and row count
            excel_file = pd.ExcelFile(file_path)
            sheets = excel_file.sheet_names
            
            # Get row count from first sheet
            df = pd.read_excel(file_path, sheet_name=sheets[0])
            row_count = len(df)
            
            excel_files.append(ExcelFileInfo(
                filename=file_path.name,
                sheets=sheets,
                row_count=row_count
            ))
        except Exception as e:
            print(f"Error reading {file_path.name}: {e}")
            continue
    
    return excel_files


@app.get("/api/data/{filename}", response_model=ExcelDataResponse)
async def get_excel_data(filename: str, sheet: str = None):
    """
    Get data from a specific Excel file.
    
    Args:
        filename: Name of the Excel file (e.g., "sales.xlsx")
        sheet: Optional sheet name (defaults to first sheet)
    """
    file_path = EXCEL_FOLDER / filename
    
    if not file_path.exists():
        raise HTTPException(status_code=404, detail=f"File {filename} not found")
    
    try:
        # Read Excel file
        excel_file = pd.ExcelFile(file_path)
        
        # Use specified sheet or first sheet
        if sheet is None:
            sheet = excel_file.sheet_names[0]
        
        if sheet not in excel_file.sheet_names:
            raise HTTPException(
                status_code=400,
                detail=f"Sheet '{sheet}' not found in {filename}"
            )
        
        # Read the sheet
        df = pd.read_excel(file_path, sheet_name=sheet)
        
        # Convert to list of dictionaries
        data = df.fillna("").to_dict(orient="records")
        
        return ExcelDataResponse(
            filename=filename,
            sheet=sheet,
            data=data,
            columns=list(df.columns),
            row_count=len(df)
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/health")
async def health():
    """Health check endpoint."""
    return {"status": "healthy", "excel_folder": str(EXCEL_FOLDER)}


# =============================================================================
# Serve React UI
# =============================================================================

if UI_DIST_PATH.exists():
    app.mount("/assets", StaticFiles(directory=UI_DIST_PATH / "assets"), name="assets")
    
    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        """Serve the React SPA."""
        if full_path.startswith("api/"):
            raise HTTPException(status_code=404, detail="Not found")
        
        file_path = UI_DIST_PATH / full_path
        if file_path.is_file():
            return FileResponse(file_path)
        
        return FileResponse(UI_DIST_PATH / "index.html")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=3000)
```

### Step 4: Create Your React UI

Update `ui/src/App.tsx` with your Excel viewer:

```tsx
import { useState, useEffect } from 'react';
import { ExcelFileList } from './components/ExcelFileList';
import { ExcelDataTable } from './components/ExcelDataTable';

interface ExcelFile {
  filename: string;
  sheets: string[];
  row_count: number;
}

function App() {
  const [files, setFiles] = useState<ExcelFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [selectedSheet, setSelectedSheet] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load list of Excel files
    fetch('/api/files')
      .then(res => res.json())
      .then(data => {
        setFiles(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading files:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">Loading Excel files...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Excel Data Viewer</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* File List Sidebar */}
          <div className="lg:col-span-1">
            <ExcelFileList
              files={files}
              selectedFile={selectedFile}
              onSelectFile={(filename, sheet) => {
                setSelectedFile(filename);
                setSelectedSheet(sheet);
              }}
            />
          </div>
          
          {/* Data Table */}
          <div className="lg:col-span-2">
            {selectedFile && selectedSheet ? (
              <ExcelDataTable
                filename={selectedFile}
                sheet={selectedSheet}
              />
            ) : (
              <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
                Select an Excel file to view its data
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
```

Create `ui/src/components/ExcelFileList.tsx`:

```tsx
interface ExcelFile {
  filename: string;
  sheets: string[];
  row_count: number;
}

interface ExcelFileListProps {
  files: ExcelFile[];
  selectedFile: string | null;
  onSelectFile: (filename: string, sheet: string) => void;
}

export function ExcelFileList({ files, selectedFile, onSelectFile }: ExcelFileListProps) {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Excel Files</h2>
      </div>
      <div className="divide-y">
        {files.length === 0 ? (
          <div className="p-4 text-sm text-gray-500">
            No Excel files found. Add .xlsx files to data/excel/
          </div>
        ) : (
          files.map(file => (
            <div key={file.filename} className="p-4">
              <div
                className={`font-medium cursor-pointer hover:text-blue-600 ${
                  selectedFile === file.filename ? 'text-blue-600' : ''
                }`}
                onClick={() => onSelectFile(file.filename, file.sheets[0])}
              >
                {file.filename}
              </div>
              <div className="text-sm text-gray-500 mt-1">
                {file.row_count.toLocaleString()} rows • {file.sheets.length} sheet{file.sheets.length !== 1 ? 's' : ''}
              </div>
              {file.sheets.length > 1 && (
                <div className="mt-2 space-y-1">
                  {file.sheets.map(sheet => (
                    <div
                      key={sheet}
                      className="text-sm text-gray-600 cursor-pointer hover:text-blue-600 pl-4"
                      onClick={() => onSelectFile(file.filename, sheet)}
                    >
                      📄 {sheet}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
```

Create `ui/src/components/ExcelDataTable.tsx`:

```tsx
import { useState, useEffect } from 'react';

interface ExcelDataTableProps {
  filename: string;
  sheet: string;
}

interface ExcelData {
  filename: string;
  sheet: string;
  data: Record<string, any>[];
  columns: string[];
  row_count: number;
}

export function ExcelDataTable({ filename, sheet }: ExcelDataTableProps) {
  const [data, setData] = useState<ExcelData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    
    fetch(`/api/data/${filename}?sheet=${encodeURIComponent(sheet)}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to load data');
        return res.json();
      })
      .then((data: ExcelData) => {
        setData(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [filename, sheet]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        Loading data...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center text-red-600">
        Error: {error}
      </div>
    );
  }

  if (!data || data.data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
        No data found
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">{data.filename}</h2>
        <p className="text-sm text-gray-500">Sheet: {data.sheet} • {data.row_count.toLocaleString()} rows</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {data.columns.map(column => (
                <th key={column} className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y">
            {data.data.map((row, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                {data.columns.map(column => (
                  <td key={column} className="px-4 py-2 text-sm">
                    {row[column] ?? ''}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

### Step 5: Update API Service

Update `ui/src/services/api.ts`:

```typescript
const API_BASE = '/api';

export async function getExcelFiles() {
  const res = await fetch(`${API_BASE}/files`);
  if (!res.ok) throw new Error('Failed to fetch files');
  return res.json();
}

export async function getExcelData(filename: string, sheet?: string) {
  const params = new URLSearchParams();
  if (sheet) params.set('sheet', sheet);
  const res = await fetch(`${API_BASE}/data/${filename}?${params}`);
  if (!res.ok) throw new Error('Failed to fetch data');
  return res.json();
}
```

### Step 6: Launch with Docker

**No local Node.js or Python needed!**

```bash
# 1. Navigate to src directory
cd deployer-apps/citizen-dev7/src

# 2. Add your Excel files
mkdir -p data/excel
# Copy your Excel files here: cp ~/Documents/sales.xlsx data/excel/

# 3. Launch (builds UI + runs backend)
./scripts/docker-dev.sh

# 4. Open http://localhost:3000
```

**What happens:**
- ✅ Docker builds React UI (no Node.js needed locally)
- ✅ Docker installs Python dependencies (pandas, openpyxl)
- ✅ Docker runs FastAPI backend
- ✅ Backend reads Excel files from `data/excel/` folder
- ✅ UI displays the data in a table

### Step 7: Development Workflow

**Backend changes (Python):**
- ✅ Edit `api.py` → Changes reflect immediately (hot reload)
- ✅ Add new Python files → Works automatically
- ✅ Modify Excel reading logic → Instant updates

**Frontend changes (React):**
- Option 1: Rebuild (slower)
  ```bash
  ./scripts/docker-dev.sh --build
  ```

- Option 2: Run UI separately (faster, recommended)
  ```bash
  # Terminal 1: Backend (Docker)
  ./scripts/docker-dev.sh

  # Terminal 2: UI (local, instant reload)
  cd ui && npm run dev
  ```

## Key Points

1. **No Local Dependencies**: Everything runs in Docker
   - No Node.js installation needed
   - No Python installation needed
   - No build tools (esbuild, etc.) needed

2. **Excel Files Location**: Put `.xlsx` files in `data/excel/` folder
   - The backend reads from this folder
   - Add/remove files → Refresh browser to see changes

3. **Hot Reload**: Backend changes apply immediately
   - Edit `api.py` → Save → Test immediately
   - No rebuild needed for Python changes

4. **Production Ready**: Same Docker setup works for production
   - Multi-stage build optimizes image size
   - Kubernetes deployment ready

## Example: Adding More Features

### Filter/Search Data

Add to `api.py`:

```python
@app.get("/api/data/{filename}/search")
async def search_excel_data(
    filename: str,
    sheet: str,
    column: str,
    query: str
):
    """Search within Excel data."""
    file_path = EXCEL_FOLDER / filename
    df = pd.read_excel(file_path, sheet_name=sheet)
    
    # Filter rows where column contains query
    filtered = df[df[column].astype(str).str.contains(query, case=False, na=False)]
    
    return {
        "data": filtered.fillna("").to_dict(orient="records"),
        "columns": list(df.columns),
        "row_count": len(filtered)
    }
```

### Export to CSV

```python
@app.get("/api/data/{filename}/export")
async def export_to_csv(filename: str, sheet: str):
    """Export Excel sheet to CSV."""
    file_path = EXCEL_FOLDER / filename
    df = pd.read_excel(file_path, sheet_name=sheet)
    
    csv_data = df.to_csv(index=False)
    return Response(
        content=csv_data,
        media_type="text/csv",
        headers={"Content-Disposition": f'attachment; filename="{sheet}.csv"'}
    )
```

## Troubleshooting

**Excel files not showing:**
- Check files are in `data/excel/` folder
- Verify files are `.xlsx` format (not `.xls`)
- Check file permissions

**Backend errors:**
- Check `requirements.txt` includes `pandas` and `openpyxl`
- Rebuild: `./scripts/docker-dev.sh --build`

**UI not updating:**
- Rebuild Docker image: `./scripts/docker-dev.sh --build`
- Or run UI separately: `cd ui && npm run dev`

## Summary

**Yes, they can launch it!** The Docker-first approach means:

1. ✅ Put Excel files in `data/excel/`
2. ✅ Replace `api.py` with Excel reader code
3. ✅ Update React UI components
4. ✅ Run `./scripts/docker-dev.sh`
5. ✅ Open http://localhost:3000

**No local Node.js, Python, or build tools needed!** Everything runs in Docker.
