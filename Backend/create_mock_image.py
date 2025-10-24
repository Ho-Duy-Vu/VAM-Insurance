"""
Generate a simple mock image for testing
"""
from PIL import Image, ImageDraw, ImageFont
import os

def create_mock_document():
    # Create a simple mock document image
    width, height = 800, 1000
    img = Image.new('RGB', (width, height), color='white')
    draw = ImageDraw.Draw(img)
    
    # Try to use a default font, fall back to basic if not available
    try:
        font = ImageFont.truetype("arial.ttf", 16)
        title_font = ImageFont.truetype("arial.ttf", 20)
    except:
        font = ImageFont.load_default()
        title_font = ImageFont.load_default()
    
    # Draw document header
    draw.text((50, 50), "ANIMAL HEALTH CERTIFICATE", fill='black', font=title_font)
    draw.text((50, 100), "Species: Reindeer", fill='black', font=font)
    
    # Draw table headers
    y_pos = 150
    draw.text((50, y_pos), "Name", fill='black', font=font)
    draw.text((200, y_pos), "Microchip", fill='black', font=font)
    draw.text((350, y_pos), "Rabies Status", fill='black', font=font)
    
    # Draw animal data
    animals = ["DASHER", "VIXEN", "COMET", "CUPID", "DONNER"]
    for i, animal in enumerate(animals):
        y = y_pos + 30 + (i * 25)
        draw.text((50, y), animal, fill='black', font=font)
        if animal == "DASHER":
            draw.text((200, y), "SANTA", fill='black', font=font)
            draw.text((350, y), "NEGATIVE", fill='black', font=font)
        else:
            draw.text((350, y), "Blue line", fill='blue', font=font)
    
    # Draw signature area
    sig_y = y_pos + 200
    draw.text((50, sig_y), "ISSUING VETERINARIAN'S CERTIFICATION", fill='black', font=title_font)
    draw.text((50, sig_y + 40), "Dr. Certein, VMD", fill='black', font=font)
    draw.text((50, sig_y + 60), "5251 DR. MARTIN Luther King JR. AVE", fill='black', font=font)
    draw.text((50, sig_y + 80), "Office of the State Veterinarian", fill='black', font=font)
    draw.text((50, sig_y + 100), "Date: Winter Solstice 12/21/2017", fill='black', font=font)
    
    # Draw signature box
    draw.rectangle([50, sig_y + 120, 300, sig_y + 180], outline='black', width=2)
    draw.text((60, sig_y + 140), "Veterinarian Signature", fill='gray', font=font)
    
    return img

if __name__ == "__main__":
    # Create data directory if it doesn't exist
    os.makedirs("data/docs", exist_ok=True)
    
    # Generate mock document
    mock_doc = create_mock_document()
    mock_doc.save("data/docs/sample_document.png")
    print("Mock document created: data/docs/sample_document.png")