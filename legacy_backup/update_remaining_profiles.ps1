$root = "c:/Users/bizgg/Downloads/Homepage"
$files = Get-ChildItem -Path $root -Filter "*.html" -Recurse

# Additional mappings for professionals found in verification
$replacements = @{
    "avatar-6.jpg" = "assets/images/profiles/profile_07.png" # Lawyer
    "avatar-9.jpg" = "assets/images/profiles/profile_08.png" # Consultant
    "avatar-7.jpg" = "assets/images/profiles/profile_09.png" # Scrivener
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
        # Regex to match src="...avatar-N.jpg"
        $pattern = "src=""[^""]*?/$key""" 
        $newSrc = "src=""" + $relativeRoot + $replacements[$key] + """"
        
        if ($content -match $pattern) {
            $content = $content -replace $pattern, $newSrc
            $modified = $true
        }
    }
    
    if ($modified) {
        Set-Content -Path $file.FullName -Value $content
        Write-Host "Updated professional profiles in $($file.Name)"
    }
}
