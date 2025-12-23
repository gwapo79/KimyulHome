$root = "c:/Users/bizgg/Downloads/Homepage"
$files = Get-ChildItem -Path $root -Filter "*.html" -Recurse

# Updated mappings for professionals (v2) to avoid public figure resemblance
$replacements = @{
    "avatar-6.jpg" = "assets/images/profiles/profile_07_v2.png" # Lawyer
    "avatar-9.jpg" = "assets/images/profiles/profile_08_v2.png" # Consultant
    "avatar-7.jpg" = "assets/images/profiles/profile_09_v2.png" # Scrivener
    
    # Also updating previous matches if they were already replaced by the "v1" custom images
    # The previous script replaced "avatar-X" with "profile_X.png".
    # So we must ALSO look for the "profile_X.png" that we just put in, and replace it with "profile_X_v2.png"
    
     "profile_07.png" = "profile_07_v2.png"
     "profile_08.png" = "profile_08_v2.png"
     "profile_09.png" = "profile_09_v2.png"
}

foreach ($file in $files) {
    $content = Get-Content -Path $file.FullName -Raw
    $modified = $false
    
    $relativeRoot = ""
    $depth = ($file.DirectoryName.Substring($root.Length).Split('\') | Where-Object { $_ -ne "" }).Count
    if ($depth -gt 0) {
        $relativeRoot = "../" * $depth
    }

    foreach ($key in $replacements.Keys) {
        # Check if the key is a "profile_XX.png" (already relative path in file) or original "avatar"
        
        if ($key -like "profile_*.png") {
            # Replacing the file we newly added. The path in HTML is like "assets/images/profiles/profile_07.png"
            # We want to replace just the filename part or the whole path.
            # Easiest is to replace the filename string.
            if ($content -match $key) {
                $content = $content.Replace($key, $replacements[$key])
                $modified = $true
            }
        }
        else {
            # Replacing the original placeholder if it still exists
            $pattern = "src=""[^""]*?/$key""" 
            $newSrc = "src=""" + $relativeRoot + $replacements[$key] + """"
            if ($content -match $pattern) {
                $content = $content -replace $pattern, $newSrc
                $modified = $true
            }
        }
    }
    
    if ($modified) {
        Set-Content -Path $file.FullName -Value $content
        Write-Host "Updated profiles to v2 in $($file.Name)"
    }
}
