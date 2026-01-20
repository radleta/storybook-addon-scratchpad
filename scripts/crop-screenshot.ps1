Add-Type -AssemblyName System.Drawing

$inputPath = "D:\dev\github\storybook-addon-scratchpad\docs\screenshot-panel.png"
$outputPath = "D:\dev\github\storybook-addon-scratchpad\docs\screenshot-panel-cropped.png"

# Load the image
$image = [System.Drawing.Image]::FromFile($inputPath)

# Crop region: just the addon panel (tabs + content + buttons)
# x=300, y=390, width=900, height=310 (tight crop on panel only)
$cropRect = New-Object System.Drawing.Rectangle(300, 390, 900, 310)

# Create bitmap and crop
$bitmap = New-Object System.Drawing.Bitmap($image)
$croppedBitmap = $bitmap.Clone($cropRect, $bitmap.PixelFormat)

# Save
$croppedBitmap.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)

# Cleanup
$croppedBitmap.Dispose()
$bitmap.Dispose()
$image.Dispose()

Write-Host "Cropped screenshot saved to docs/screenshot-panel-cropped.png"
Write-Host "Dimensions: 920x450"
