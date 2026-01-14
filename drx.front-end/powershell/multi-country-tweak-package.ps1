$package = New-Package "multi-country-tweak"
$package.Sources.Clear()

$package.Metadata.Author = "Mounir Zarkan"
$package.Metadata.Publisher = "DRX"
$package.Metadata.Version = "1.0"
$package.Metadata.Readme = @"
Set of instructions for the user.
"@

# Items using New-ItemSource and New-ExplicitItemSource

$sources @(
     "/sitecore/content/drx/XX/Content Modules/Adaptive Forms/About Me 2"
     "/sitecore/content/drx/US/Content Modules/Address/default 2"
)

$countries = @(
    "AU"
    "NZ"
    "CA"
    "JP"
    "FR"
    "KR"
    "IT"
    "GB"
    "IE"
)

foreach($c in $countries){

    foreach($s in $sources){
            $sourceStr = $s.Replace("XX", $c)
            $source = Get-Item -Path "master:$($sourceStr)" | New-ItemSource -Name "about me  $($c)" -InstallMode Overwrite

            $package.Sources.Add($source)

    }   

}

Export-Package -Project $package -Path "$($package.Name)-$($package.Metadata.Version).xml"
Export-Package -Project $package -Path "$($package.Name)-$($package.Metadata.Version).zip" -Zip
Download-File "$SitecorePackageFolder\$($package.Name)-$($package.Metadata.Version).zip"