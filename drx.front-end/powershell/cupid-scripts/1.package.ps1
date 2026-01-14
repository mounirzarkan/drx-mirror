$ItemsToBeDeployed = @(
    @{ Recursive = $TRUE; Source = "master:/sitecore/layout/Renderings/Feature/Components/DRX/Content" },
    @{ Recursive = $TRUE; Source = "master:/sitecore/system/Automation" },

    @{ Recursive = $TRUE; Source = "master:/sitecore/templates/Project/Automation" },
    @{ Recursive = $TRUE; Source = "master:/sitecore/templates/Project/Drx" },
   
);
 
$ErrorActionPreference = "Stop"
 
$Package = New-Package -Name "cupid pre-package";
$Package.Sources.Clear();
$Package.Metadata.Author = "PowerShell";
$Package.Metadata.Publisher = "Mounir Zarkan";
$Package.Metadata.Version = Get-Date -Format FileDateTimeUniversal;
$Package.Metadata.Readme = 'This will install a Sitecore Package generated using PowerShell'
 
ForEach ($Item in $ItemsToBeDeployed)
{
  if ($Item.Recursive)
  {
    $Source = Get-Item $Item.Source | New-ItemSource -Name "N/A" -InstallMode Overwrite
    $Package.Sources.Add($Source);
  }
  else
  {
    $Source = Get-Item $Item.Source | New-ExplicitItemSource -Name "N/A" -InstallMode Overwrite
    $Package.Sources.Add($Source);
  }
}
 
# Save and Download Package
Export-Package -Project $package -Path "$( $package.Name ) - $( $package.Metadata.Version ).zip" -Zip
Download-File "$SitecorePackageFolder\$( $package.Name ) - $( $package.Metadata.Version ).zip"