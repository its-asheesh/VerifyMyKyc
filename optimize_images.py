import os
from PIL import Image, ImageOps

# List of images to process
TARGET_IMAGES = [
    "aadhaar.jpg",
    "pan.jpg",
    "passport.jpg",
    "voter.jpg",
    "drivinglicence.jpg",
    "vehicle.jpg",
    "gst.jpg",
    "company.jpg",
    "VehicleVerification.jpg"
]

BASE_DIR = "client/public"
OUTPUT_DIR = "client/public/optimized"

def optimize_image(filename):
    input_path = os.path.join(BASE_DIR, filename)
    
    if not os.path.exists(input_path):
        print(f"Skipping {filename}: File not found")
        return

    try:
        img = Image.open(input_path)
        
        # Convert to RGBA to handle transparency
        img = img.convert("RGBA")
        
        # Create a white background image to handle transparency for bbox calculation
        bg = Image.new("RGBA", img.size, (255, 255, 255, 255))
        diff = Image.composite(img, bg, img)
        
        # Convert to grayscale and invert to find non-white pixels
        gray = diff.convert("L")
        # Threshold to treat near-white as white (e.g., compression artifacts)
        threshold = 250
        mask = gray.point(lambda p: 255 if p < threshold else 0)
        
        # Get bounding box of non-white content
        bbox = mask.getbbox()
        
        if bbox:
            # Crop to content
            img_cropped = img.crop(bbox)
            
            # Add small padding (0px) to maximize coverage
            padding = 0
            width, height = img_cropped.size
            new_width = width + 2 * padding
            new_height = height + 2 * padding
            
            final_img = Image.new("RGBA", (new_width, new_height), (255, 255, 255, 0))
            final_img.paste(img_cropped, (padding, padding))
            
            # Resize if too large (e.g., width > 600)
            max_width = 600
            if new_width > max_width:
                ratio = max_width / new_width
                new_height = int(new_height * ratio)
                final_img = final_img.resize((max_width, new_height), Image.Resampling.LANCZOS)
            
            # Save
            # If original was JPG, save as JPG with white background (unless user wants transparent)
            # For "cleaner", PNG with transparency is usually better for cards on white/gray backgrounds.
            # But to replace existing files, we might need to keep extension or update code.
            # I'll save as PNG in an optimized folder first.
            
            if not os.path.exists(OUTPUT_DIR):
                os.makedirs(OUTPUT_DIR)
                
            output_filename = os.path.splitext(filename)[0] + ".png"
            output_path = os.path.join(OUTPUT_DIR, output_filename)
            
            final_img.save(output_path, "PNG")
            print(f"Processed {filename} -> {output_filename}")
            
        else:
            print(f"Skipping {filename}: Empty or all white")
            
    except Exception as e:
        print(f"Error processing {filename}: {e}")

if __name__ == "__main__":
    print("Starting image optimization...")
    for img_name in TARGET_IMAGES:
        optimize_image(img_name)
    print("Done! Check client/public/optimized/")
