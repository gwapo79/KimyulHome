$root = "c:/Users/bizgg/Downloads/Homepage"
$files = Get-ChildItem -Path $root -Filter "*.html" -Recurse

# Profile Map: Old file usage -> New Image
# Based on inspection of reviews.html:
# avatar-1.jpg -> profile_02.png (Young Female - Real estate fraud victim?) -> Actually let's mix matches.
# Let's map loosely based on role description I saw earlier.

# Role Mapping Hypothesis:
# 김○○ (Real Estate Victim) -> profile_02 (Young Woman) or profile_04 (Young Man)
# 박○○ (Debtor) -> profile_01 (Middle-aged Man)
# 이○○ (Rehabilitation) -> profile_03 (Middle-aged Woman)
# 최○○ (Auction) -> profile_06 (Business Woman - looks professional/client)
# 정○○ (Inheritance) -> profile_05 (Elderly Man - logical for inheritance issues?)
# 한○○ (Bond Seizure) -> profile_04 (Young Man)

# We need to find where these old images are used.
# They are seemingly random URLs or placeholders like "avatar-1.jpg" in the original code, 
# or possibly "https://storage.googleapis.com/.../avatar-X.jpg".

# Script Strategy:
# 1. Identify all <img> tags that look like profiles.
#    - Common feature: class="...rounded-full..."
#    - Or simply replace specific known external URLs with local assets.
#    - index.html/reviews.html used `https://storage.googleapis.com/.../avatar-N.jpg`

foreach ($file in $files) {
    $content = Get-Content -Path $file.FullName -Raw
    $modified = $false
    
    $relativeRoot = ""
    $depth = ($file.DirectoryName.Substring($root.Length).Split('\') | Where-Object { $_ -ne "" }).Count
    if ($depth -gt 0) {
        $relativeRoot = "../" * $depth
    }
    
    # Map of old patterns to new local files
    # Note: Regex needs simply to find the src="..." and replace it if it matches the pattern
    
    $replacements = @{
        "avatar-1.jpg" = "assets/images/profiles/profile_02.png" 
        "avatar-2.jpg" = "assets/images/profiles/profile_01.png"
        "avatar-3.jpg" = "assets/images/profiles/profile_03.png"
        "avatar-4.jpg" = "assets/images/profiles/profile_06.png"
        "avatar-5.jpg" = "assets/images/profiles/profile_05.png"
        "avatar-8.jpg" = "assets/images/profiles/profile_04.png"
    }
    
    foreach ($key in $replacements.Keys) {
        # Regex to match src="...avatar-N.jpg"
        # We handle any prefix before the filename
        $pattern = "src=""[^""]*?/$key""" 
        $newSrc = "src=""" + $relativeRoot + $replacements[$key] + """"
        
        if ($content -match $pattern) {
            $content = $content -replace $pattern, $newSrc
            $modified = $true
            # Write-Host "Replaced $key in $($file.Name)"
        }
    }
    
    # Also look for any other "rounded-full" images that might be generic placeholders (like https://via.placeholder.com...)
    # index.html hero image? No, that's a big background.
    
    if ($modified) {
        Set-Content -Path $file.FullName -Value $content
        Write-Host "Updated profiles in $($file.Name)"
    }
}
