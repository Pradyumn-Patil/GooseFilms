#!/usr/bin/env python3
"""
Generate a simple favicon.ico for GooseFilms
Creates a 16x16 icon with a film strip pattern
"""

import struct
import os

def create_favicon():
    # Create a 16x16 icon with film strip design
    # Purple background with gold film strip pattern
    
    # Define colors (BGR format for ICO)
    purple = (0xC1, 0x46, 0x6B)  # #6B46C1
    gold = (0x0B, 0x9E, 0xF5)     # #F59E0B
    white = (0xFF, 0xFF, 0xFF)   # #FFFFFF
    
    # Create 16x16 pixel data (film strip pattern)
    pixels = []
    for y in range(16):
        for x in range(16):
            # Film strip holes at top and bottom
            if (y < 3 or y >= 13) and x % 4 < 2:
                pixels.append(gold)
            # Middle film area
            elif 5 <= y <= 10:
                pixels.append(gold)
            else:
                pixels.append(purple)
    
    # ICO file structure
    # ICONDIR structure
    icondir = struct.pack('<HHH', 
        0,      # Reserved, must be 0
        1,      # Type (1 for ICO)
        1       # Number of images
    )
    
    # ICONDIRENTRY structure
    icondirentry = struct.pack('<BBBBHHII',
        16,     # Width
        16,     # Height
        0,      # Color palette (0 for true color)
        0,      # Reserved
        1,      # Color planes
        32,     # Bits per pixel
        40 + (16 * 16 * 4) + (16 * 16 // 8),  # Size of image data
        22      # Offset to image data
    )
    
    # BITMAPINFOHEADER structure
    bitmapinfoheader = struct.pack('<IIIHHIIIIII',
        40,     # Header size
        16,     # Width
        32,     # Height (double for XOR and AND mask)
        1,      # Planes
        32,     # Bits per pixel
        0,      # Compression (BI_RGB)
        0,      # Image size (0 for BI_RGB)
        0,      # X pixels per meter
        0,      # Y pixels per meter
        0,      # Colors used
        0       # Important colors
    )
    
    # Convert pixels to bytes (BGRA format)
    pixel_data = b''
    # Write pixels bottom-up (BMP format)
    for y in range(15, -1, -1):
        for x in range(16):
            color = pixels[y * 16 + x]
            pixel_data += struct.pack('BBBB', color[0], color[1], color[2], 255)
    
    # AND mask (all transparent)
    and_mask = b'\x00' * (16 * 16 // 8)
    
    # Combine all parts
    ico_data = icondir + icondirentry + bitmapinfoheader + pixel_data + and_mask
    
    # Write to file
    with open('favicon.ico', 'wb') as f:
        f.write(ico_data)
    
    print("✅ favicon.ico created successfully!")
    print("🎬 GooseFilms favicon with purple background and gold film strip")

if __name__ == '__main__':
    create_favicon()