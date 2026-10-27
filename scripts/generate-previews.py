import os
import subprocess
import json

base_image = "public/assets/default-character-square.jpg"
output_dir = "public/previews"
os.makedirs(output_dir, exist_ok=True)

# List of 100 styles with specific ImageMagick operations to create authentic previews of the reference face
styles = [
  # Group 1: Classic & Vintage
  ("g01-s01", "-modulate 105,85,100 -sepia-tone 40% -gamma 1.05"),
  ("g01-s02", "-level 10%,90% -tint 120 -fill '#a855f7' -tint 30% -fill '#06b6d4' -tint 20%"),
  ("g01-s03", "-modulate 115,120,105 -tint 80 -fill '#f472b6' -tint 35%"),
  ("g01-s04", "-colorspace Gray -contrast-stretch 5%x25% -fill '#1e293b' -tint 40%"),
  ("g01-s05", "-modulate 105,115,95 -fill '#15803d' -tint 15% -gamma 1.1"),
  ("g01-s06", "-modulate 110,130,100 -edge 1 -negate -threshold 90% -blur 0x1 /tmp/edges.png ; convert public/assets/default-character-square.jpg /tmp/edges.png -compose Multiply -composite -modulate 110,135,100"),
  ("g01-s07", "-fill '#7c3aed' -tint 35% -contrast-stretch 10%x15%"),
  ("g01-s08", "-colorspace Gray -sketch 0x5+120 -contrast"),
  ("g01-s09", "-fill '#ca8a04' -tint 30% -gamma 0.95 -contrast"),
  ("g01-s10", "-modulate 115,140,100 -level 15%,85%"),

  # Group 2: Modern Anime
  ("g02-s01", "-fill '#3b82f6' -tint 30% -contrast-stretch 5%x10% -modulate 110,130,100"),
  ("g02-s02", "-level 5%,95% -fill '#ea580c' -tint 25% -fill '#0284c7' -tint 25% -gamma 1.05"),
  ("g02-s03", "-modulate 95,70,100 -fill '#334155' -tint 25% -contrast"),
  ("g02-s04", "-modulate 115,110,105 -blur 0x1 -fill '#fde047' -tint 15%"),
  ("g02-s05", "-posterize 5 -fill '#ec4899' -tint 40% -modulate 120,160,100"),
  ("g02-s06", "-modulate 115,140,100 -contrast -contrast"),
  ("g02-s07", "-modulate 110,105,100 -fill '#38bdf8' -tint 20% -gamma 1.1"),
  ("g02-s08", "-modulate 90,60,100 -fill '#0f172a' -tint 40%"),
  ("g02-s09", "-modulate 110,140,100 -fill '#f43f5e' -tint 20% -fill '#38bdf8' -tint 25%"),
  ("g02-s10", "-modulate 110,110,105 -fill '#fb923c' -tint 25%"),

  # Group 3: Manga & Comics
  ("g03-s01", "-colorspace Gray -contrast-stretch 15%x15% -threshold 45%"),
  ("g03-s02", "-colorspace Gray -contrast -fill '#2563eb' -tint 45% -level 10%,90%"),
  ("g03-s03", "-colorspace Gray -edge 2 -negate -contrast-stretch 20%x10%"),
  ("g03-s04", "-posterize 4 -fill '#9333ea' -tint 40% -modulate 120,150,100"),
  ("g03-s05", "-modulate 120,95,100 -fill '#f472b6' -tint 25%"),
  ("g03-s06", "-colorspace Gray -fill '#06b6d4' -tint 30% -blur 0x1"),
  ("g03-s07", "-colorspace Gray -level 10%,90% -fill '#06b6d4' -tint 25%"),
  ("g03-s08", "-colorspace Gray -motion-blur 0x8+45 -contrast"),
  ("g03-s09", "-modulate 125,140,100 -contrast"),
  ("g03-s10", "-colorspace Gray -sketch 0x8+45 -gamma 1.1"),

  # Group 4: Video Game Art
  ("g04-s01", "-modulate 115,120,100 -fill '#06b6d4' -tint 20% -gamma 1.05"),
  ("g04-s02", "-colorspace Gray -threshold 50% -fill '#dc2626' -opaque black"),
  ("g04-s03", "-fill '#ea580c' -tint 40% -contrast-stretch 10%x15%"),
  ("g04-s04", "-posterize 8 -modulate 115,140,100"),
  ("g04-s05", "-fill '#1e293b' -tint 30% -fill '#38bdf8' -tint 20% -contrast"),
  ("g04-s06", "-fill '#7c3aed' -tint 30% -fill '#fbbf24' -tint 20% -blur 0x1"),
  ("g04-s07", "-colorspace Gray -threshold 35% -fill '#1e1b4b' -opaque black"),
  ("g04-s08", "-edge 1 -negate /tmp/edge2.png ; convert public/assets/default-character-square.jpg /tmp/edge2.png -compose Multiply -composite -fill '#ca8a04' -tint 30%"),
  ("g04-s09", "-fill '#15803d' -tint 25% -fill '#38bdf8' -tint 25% -gamma 1.1"),
  ("g04-s10", "-level 10%,90% -fill '#facc15' -tint 30% -fill '#ec4899' -tint 30%"),

  # Group 5: Pixel Art
  ("g05-s01", "-resize 64x64 -sample 600x600 -colors 16"),
  ("g05-s02", "-resize 96x96 -sample 600x600 -colors 32"),
  ("g05-s03", "-resize 48x48 -sample 600x600 -colors 8"),
  ("g05-s04", "-resize 80x80 -sample 600x600 -fill '#f59e0b' -tint 20%"),
  ("g05-s05", "-resize 72x72 -sample 600x600 -fill '#a855f7' -tint 35%"),
  ("g05-s06", "-colorspace Gray -resize 64x64 -sample 600x600 -remap pattern:gray50 -fill '#8bac0f' -tint 80%"),
  ("g05-s07", "-resize 64x64 -sample 600x600 -fill '#7f1d1d' -tint 35%"),
  ("g05-s08", "-resize 32x32 -sample 600x600 -colors 8"),
  ("g05-s09", "-resize 64x64 -sample 600x600 -modulate 120,150,100"),
  ("g05-s10", "-resize 80x80 -sample 600x600 -level 10%,90%"),

  # Group 6: Concept Art
  ("g06-s01", "-paint 4 -fill '#b45309' -tint 25% -gamma 0.95"),
  ("g06-s02", "-modulate 80,50,100 -fill '#451a03' -tint 30% -contrast"),
  ("g06-s03", "-modulate 125,70,100 -fill '#06b6d4' -tint 25%"),
  ("g06-s04", "-fill '#15803d' -tint 35% -gamma 1.05"),
  ("g06-s05", "-fill '#6b21a8' -tint 35% -fill '#06b6d4' -tint 20%"),
  ("g06-s06", "-fill '#0284c7' -tint 30% -fill '#7c3aed' -tint 25%"),
  ("g06-s07", "-fill '#78716c' -tint 35% -fill '#16a34a' -tint 15%"),
  ("g06-s08", "-colorspace Gray -fill '#dc2626' -tint 15% -contrast"),
  ("g06-s09", "-fill '#15803d' -tint 60% -contrast-stretch 10%x15%"),
  ("g06-s10", "-fill '#312e81' -tint 45% -fill '#facc15' -tint 20%"),

  # Group 7: Chibi & Cute
  ("g07-s01", "-modulate 115,120,100 -blur 0x1 -fill '#f472b6' -tint 20%"),
  ("g07-s02", "-posterize 10 -modulate 110,115,100"),
  ("g07-s03", "-modulate 125,90,100 -fill '#fbcfe8' -tint 35%"),
  ("g07-s04", "-paint 3 -modulate 105,105,100"),
  ("g07-s05", "-modulate 115,130,100 -fill '#2563eb' -tint 20%"),
  ("g07-s06", "-sketch 0x4+60 -fill '#fef08a' -tint 30%"),
  ("g07-s07", "-fill '#d97706' -tint 35% -gamma 1.05"),
  ("g07-s08", "-modulate 120,150,100 -contrast"),
  ("g07-s09", "-sketch 0x2+30 -modulate 110,120,100"),
  ("g07-s10", "-posterize 4 -modulate 125,140,100"),

  # Group 8: Experimental
  ("g08-s01", "-edge 2 -negate /tmp/edge_g08.png ; convert public/assets/default-character-square.jpg -posterize 4 -fill '#b91c1c' -tint 25% /tmp/edge_g08.png -compose Multiply -composite"),
  ("g08-s02", "-channel R -roll +8+0 +channel -channel B -roll -8+0 +channel"),
  ("g08-s03", "-fill '#6366f1' -tint 35% -fill '#f472b6' -tint 25% -gamma 1.1"),
  ("g08-s04", "-resize 120x120 -sample 600x600 -posterize 6"),
  ("g08-s05", "-colorspace Gray -threshold 45% -blur 0x2 -gamma 1.2"),
  ("g08-s06", "-fill '#b45309' -tint 35% -fill '#0d9488' -tint 20%"),
  ("g08-s07", "-colorspace Gray -negate -threshold 60%"),
  ("g08-s08", "-posterize 5 -fill '#1e3a8a' -tint 35% -fill '#991b1b' -tint 25%"),
  ("g08-s09", "-paint 4 -fill '#b91c1c' -tint 25%"),
  ("g08-s10", "-edge 2 -negate -fill '#06b6d4' -tint 80%"),

  # Group 9: Realistic & Semi-Realistic
  ("g09-s01", "-level 5%,95% -modulate 105,105,100 -sharpen 0x1"),
  ("g09-s02", "-fill '#451a03' -tint 35% -contrast-stretch 10%x15% -gamma 0.95"),
  ("g09-s03", "-blur 0x1 -modulate 110,95,100 -fill '#e2e8f0' -tint 20%"),
  ("g09-s04", "-modulate 90,65,100 -fill '#44403c' -tint 30% -contrast"),
  ("g09-s05", "-sepia-tone 25% -attenuate 0.8 +noise Multiplicative"),
  ("g09-s06", "-fill '#06b6d4' -tint 25% -gamma 1.05 -contrast"),
  ("g09-s07", "-modulate 95,75,100 -fill '#475569' -tint 25% -sharpen 0x1"),
  ("g09-s08", "-colorspace Gray -contrast-stretch 5%x10% -gamma 1.1"),
  ("g09-s09", "-colorspace Gray -contrast -contrast-stretch 10%x15%"),
  ("g09-s10", "-modulate 90,85,100 -fill '#0f172a' -tint 40% -fill '#ea580c' -tint 15%"),

  # Group 10: Western Animation
  ("g10-s01", "-paint 2 -fill '#0d9488' -tint 25% -fill '#d97706' -tint 25% -contrast"),
  ("g10-s02", "-posterize 5 -fill '#ec4899' -tint 30% -fill '#06b6d4' -tint 30%"),
  ("g10-s03", "-modulate 112,118,102 -gamma 1.05 -blur 0x0.5"),
  ("g10-s04", "-colorspace Gray -sepia-tone 65% -contrast -contrast"),
  ("g10-s05", "-contrast-stretch 20%x20% -fill '#1e293b' -tint 40%"),
  ("g10-s06", "-posterize 4 -contrast-stretch 10%x10%"),
  ("g10-s07", "-sketch 0x3+60 -fill '#b45309' -tint 25%"),
  ("g10-s08", "-edge 1 -negate /tmp/edge_g10.png ; convert public/assets/default-character-square.jpg /tmp/edge_g10.png -compose Multiply -composite -contrast"),
  ("g10-s09", "-posterize 3 -fill '#f43f5e' -tint 30%"),
  ("g10-s10", "-modulate 115,125,100 -contrast")
]

print(f"Generating 100 style previews using reference character: {base_image}...")
for sid, cmd in styles:
  out_path = os.path.join(output_dir, f"{sid}.jpg")
  if ";" in cmd:
    subprocess.run(f"convert {base_image} {cmd} {out_path}", shell=True, check=True)
  else:
    full_cmd = f"convert {base_image} {cmd} {out_path}"
    subprocess.run(full_cmd, shell=True, check=True)

print("✓ Successfully generated all 100 preview images in public/previews/!")
