import xml.etree.ElementTree as ET
from xml.dom import minidom
from typing import Dict, Any
from datetime import datetime

class XMLGenerator:
    """Generate XML from parsed Visio data"""
    
    def __init__(self):
        self.namespace = "http://visio-converter.com/schema/2025"
    
    def generate_xml(self, visio_data: Dict[str, Any]) -> str:
        """Generate structured XML from Visio data"""
        
        # Create root element
        root = ET.Element("VisioDocument")
        root.set("xmlns", self.namespace)
        root.set("version", "1.0")
        root.set("generated", datetime.now().isoformat())
        
        # Add metadata
        metadata = ET.SubElement(root, "Metadata")
        ET.SubElement(metadata, "OriginalFilename").text = visio_data.get("metadata", {}).get("filename", "unknown")
        ET.SubElement(metadata, "OriginalFormat").text = visio_data.get("metadata", {}).get("format", "unknown")
        ET.SubElement(metadata, "ConvertedFormat").text = "XML"
        ET.SubElement(metadata, "ConversionTime").text = datetime.now().isoformat()
        
        # Add pages
        pages_element = ET.SubElement(root, "Pages")
        pages_element.set("count", str(len(visio_data.get("pages", []))))
        
        for page in visio_data.get("pages", []):
            page_element = ET.SubElement(pages_element, "Page")
            page_element.set("id", page.get("id", ""))
            page_element.set("name", page.get("name", ""))
            
            # Add shapes
            shapes_element = ET.SubElement(page_element, "Shapes")
            shapes_element.set("count", str(len(page.get("shapes", []))))
            
            for shape in page.get("shapes", []):
                shape_element = ET.SubElement(shapes_element, "Shape")
                shape_element.set("id", shape.get("id", ""))
                shape_element.set("type", shape.get("type", "unknown"))
                
                # Add shape properties
                if shape.get("text"):
                    text_element = ET.SubElement(shape_element, "Text")
                    text_element.text = shape.get("text")
                
                # Add geometry if available
                geometry = ET.SubElement(shape_element, "Geometry")
                geometry.set("x", str(shape.get("x", 0)))
                geometry.set("y", str(shape.get("y", 0)))
                geometry.set("width", str(shape.get("width", 0)))
                geometry.set("height", str(shape.get("height", 0)))
        
        # Add processing information
        processing = ET.SubElement(root, "ProcessingInfo")
        ET.SubElement(processing, "Status").text = "completed"
        ET.SubElement(processing, "ShapeCount").text = str(sum(len(page.get("shapes", [])) for page in visio_data.get("pages", [])))
        ET.SubElement(processing, "PageCount").text = str(len(visio_data.get("pages", [])))
        
        # Convert to pretty-printed XML string
        xml_string = ET.tostring(root, encoding='unicode')
        
        # Pretty print using minidom
        dom = minidom.parseString(xml_string)
        pretty_xml = dom.toprettyxml(indent="  ")
        
        # Remove empty lines
        lines = [line for line in pretty_xml.split('\n') if line.strip()]
        
        return '\n'.join(lines)