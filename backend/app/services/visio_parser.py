import olefile
import xml.etree.ElementTree as ET
from typing import Dict, List, Any
import os

class VisioParser:
    """Parser for Microsoft Visio files"""
    
    def __init__(self):
        self.shapes = []
        self.pages = []
        self.connections = []
    
    def parse_file(self, file_path: str) -> Dict[str, Any]:
        """Parse a Visio file and extract structure"""
        
        try:
            if file_path.lower().endswith('.vsd'):
                return self._parse_vsd(file_path)
            elif file_path.lower().endswith('.vsdx'):
                return self._parse_vsdx(file_path)
            else:
                raise ValueError("Unsupported file format")
                
        except Exception as e:
            raise Exception(f"Failed to parse Visio file: {str(e)}")
    
    def _parse_vsd(self, file_path: str) -> Dict[str, Any]:
        """Parse legacy .vsd file using olefile"""
        
        if not olefile.isOleFile(file_path):
            raise ValueError("Invalid VSD file format")
        
        # Basic VSD parsing - extract minimal structure
        visio_data = {
            "format": "vsd",
            "pages": [],
            "shapes": [],
            "metadata": {
                "filename": os.path.basename(file_path),
                "format": "Microsoft Visio Drawing (.vsd)"
            }
        }
        
        # Add sample data for demonstration
        visio_data["pages"].append({
            "id": "page1",
            "name": "Page-1",
            "shapes": []
        })
        
        return visio_data
    
    def _parse_vsdx(self, file_path: str) -> Dict[str, Any]:
        """Parse modern .vsdx file (ZIP-based)"""
        
        import zipfile
        
        visio_data = {
            "format": "vsdx",
            "pages": [],
            "shapes": [],
            "metadata": {
                "filename": os.path.basename(file_path),
                "format": "Microsoft Visio Drawing (.vsdx)"
            }
        }
        
        try:
            with zipfile.ZipFile(file_path, 'r') as vsdx_file:
                # List files in the VSDX archive
                file_list = vsdx_file.namelist()
                
                # Basic parsing - extract page information
                page_files = [f for f in file_list if f.startswith('visio/pages/page') and f.endswith('.xml')]
                
                for i, page_file in enumerate(page_files):
                    page_data = {
                        "id": f"page{i+1}",
                        "name": f"Page-{i+1}",
                        "file": page_file,
                        "shapes": []
                    }
                    
                    # Try to read page XML content
                    try:
                        with vsdx_file.open(page_file) as page_xml:
                            content = page_xml.read().decode('utf-8')
                            # Basic shape count (simplified)
                            shape_count = content.count('<Shape ')
                            for j in range(shape_count):
                                page_data["shapes"].append({
                                    "id": f"shape{j+1}",
                                    "type": "shape",
                                    "text": f"Shape {j+1}"
                                })
                    except:
                        pass
                    
                    visio_data["pages"].append(page_data)
                
                if not visio_data["pages"]:
                    # Add default page if none found
                    visio_data["pages"].append({
                        "id": "page1",
                        "name": "Page-1",
                        "shapes": []
                    })
                    
        except zipfile.BadZipFile:
            raise ValueError("Invalid VSDX file format")
        
        return visio_data