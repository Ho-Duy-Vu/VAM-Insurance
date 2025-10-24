#!/usr/bin/env python3
"""
Test script to create a sample PDF and test the upload functionality
"""

from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
import requests
import os

def create_sample_pdf():
    """Create a multi-page PDF for testing"""
    filename = "sample_multipage.pdf"
    c = canvas.Canvas(filename, pagesize=letter)
    
    # Create 3 pages
    for page_num in range(1, 4):
        # Add content to each page
        c.drawString(100, 750, f"Test Document - Page {page_num}")
        c.drawString(100, 700, f"This is the content of page {page_num}")
        c.drawString(100, 650, "Animal Health Certificate")
        c.drawString(100, 600, f"Certificate Number: AHC-2024-{1000 + page_num}")
        c.drawString(100, 550, f"Issue Date: 2024-10-{page_num + 23}")
        c.drawString(100, 500, "Veterinarian: Dr. Smith")
        c.drawString(100, 450, "Animal Type: Cattle")
        c.drawString(100, 400, f"Animal ID: {2000 + page_num}")
        
        # Add some more content
        for i in range(5):
            c.drawString(100, 350 - i*30, f"Additional line {i+1} on page {page_num}")
            
        c.showPage()  # Move to next page
    
    c.save()
    print(f"Created {filename}")
    return filename

def test_upload(pdf_file):
    """Test uploading the PDF to the backend"""
    url = "http://localhost:8000/documents/upload"
    
    try:
        with open(pdf_file, 'rb') as f:
            files = {'file': (pdf_file, f, 'application/pdf')}
            response = requests.post(url, files=files)
            
        if response.status_code == 200:
            result = response.json()
            print(f"Upload successful!")
            print(f"Document ID: {result['document_id']}")
            return result['document_id']
        else:
            print(f"Upload failed: {response.status_code}")
            print(response.text)
            return None
            
    except requests.exceptions.ConnectionError:
        print("Error: Could not connect to backend. Make sure it's running on localhost:8000")
        return None

if __name__ == "__main__":
    try:
        from reportlab.pdfgen import canvas
        from reportlab.lib.pagesizes import letter
        
        # Create sample PDF
        pdf_file = create_sample_pdf()
        
        # Test upload
        print("Testing PDF upload...")
        doc_id = test_upload(pdf_file)
        
        if doc_id:
            print(f"\nYou can view the document at:")
            print(f"http://localhost:5173/document/{doc_id}")
            
        # Clean up
        if os.path.exists(pdf_file):
            os.remove(pdf_file)
            
    except ImportError:
        print("reportlab not installed. Install it with: pip install reportlab")
        print("Creating a simple text file instead...")
        
        # Create a simple text file as fallback
        with open("test.txt", "w") as f:
            f.write("This is a test file for upload")
        print("Created test.txt - you can manually upload this through the web interface")