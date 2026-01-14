
$pre_deploy = @(

    @{ Recursive = $TRUE; Source = "$($sourceDB):/sitecore/templates/Project/Automation"; Destination = "$($destinationDB):/sitecore/templates/Project" },
    @{ Recursive = $TRUE; Source = "$($sourceDB):/sitecore/templates/Project/Drx"; Destination = "$($destinationDB):/sitecore/templates/Project" },

    @{ Recursive = $TRUE; Source = "$($sourceDB):/sitecore/layout/Renderings/Feature/Components/DRX/Content"; Destination = "$($destinationDB):/sitecore/layout/Renderings/Feature/Components/DRX" },

    @{ Recursive = $TRUE; Source = "$($sourceDB):/sitecore/system/Automation"; Destination = "$($destinationDB):/sitecore/system" },

    @{ Recursive = $TRUE; Source = "$($sourceDB):/sitecore/system/Dictionary/DRX dictionary"; Destination = "$($destinationDB):/sitecore/system/Dictionary" },
    @{ Recursive = $TRUE; Source = "$($sourceDB):/sitecore/system/Dictionary/Features"; Destination = "$($destinationDB):/sitecore/system/Dictionary" },
    
    @{ Recursive = $TRUE; Source = "$($sourceDB):/sitecore/content/drx/drx Dictionary"; Destination = "$($destinationDB):/sitecore/content/drx" }
);

$pre_deploy = @(
    @{ Recursive = $TRUE; Source = "$($sourceDB):/sitecore/content/drx/drx Dictionary"; Destination = "$($destinationDB):/sitecore/content/drx" }
);



$content = @(

    @{ Recursive = $TRUE; Source = "$($sourceDB):/sitecore/content/drx/US/Content Modules/Adaptive Forms/About Me 2"; Destination = "$($destinationDB):/sitecore/content/drx/US/Content Modules/Adaptive Forms/About Me 2" },
    @{ Recursive = $TRUE; Source = "$($sourceDB):/sitecore/content/drx/US/Content Modules/Address/default 2"; Destination = "$($destinationDB):/sitecore/content/drx/US/Content Modules/Address/default 2" },

    @{ Recursive = $TRUE; Source = "$($sourceDB):/sitecore/content/drx/AU/Content Modules/Adaptive Forms/About Me 2"; Destination = "$($destinationDB):/sitecore/content/drx/AU/Content Modules/Adaptive Forms/About Me 2" },
    @{ Recursive = $TRUE; Source = "$($sourceDB):/sitecore/content/drx/AU/Content Modules/Address/default 2"; Destination = "$($destinationDB):/sitecore/content/drx/AU/Content Modules/Address/default 2" },

    @{ Recursive = $TRUE; Source = "$($sourceDB):/sitecore/content/drx/NZ/Content Modules/Adaptive Forms/About Me 2"; Destination = "$($destinationDB):/sitecore/content/drx/NZ/Content Modules/Adaptive Forms/About Me 2" },
    @{ Recursive = $TRUE; Source = "$($sourceDB):/sitecore/content/drx/NZ/Content Modules/Address/default 2"; Destination = "$($destinationDB):/sitecore/content/drx/NZ/Content Modules/Address/default 2" },

    @{ Recursive = $TRUE; Source = "$($sourceDB):/sitecore/content/drx/CA/Content Modules/Adaptive Forms/About Me 2"; Destination = "$($destinationDB):/sitecore/content/drx/CA/Content Modules/Adaptive Forms/About Me 2" },
    @{ Recursive = $TRUE; Source = "$($sourceDB):/sitecore/content/drx/CA/Content Modules/Address/default 2"; Destination = "$($destinationDB):/sitecore/content/drx/CA/Content Modules/Address/default 2" },

    @{ Recursive = $TRUE; Source = "$($sourceDB):/sitecore/content/drx/JP/Content Modules/Adaptive Forms/About Me 2"; Destination = "$($destinationDB):/sitecore/content/drx/JP/Content Modules/Adaptive Forms/About Me 2" },
    @{ Recursive = $TRUE; Source = "$($sourceDB):/sitecore/content/drx/JP/Content Modules/Address/default 2"; Destination = "$($destinationDB):/sitecore/content/drx/JP/Content Modules/Address/default 2" },

    @{ Recursive = $TRUE; Source = "$($sourceDB):/sitecore/content/drx/FR/Content Modules/Adaptive Forms/About Me 2"; Destination = "$($destinationDB):/sitecore/content/drx/FR/Content Modules/Adaptive Forms/About Me 2" },
    @{ Recursive = $TRUE; Source = "$($sourceDB):/sitecore/content/drx/FR/Content Modules/Address/default 2"; Destination = "$($destinationDB):/sitecore/content/drx/FR/Content Modules/Address/default 2" },

    @{ Recursive = $TRUE; Source = "$($sourceDB):/sitecore/content/drx/IT/Content Modules/Adaptive Forms/About Me 2"; Destination = "$($destinationDB):/sitecore/content/drx/IT/Content Modules/Adaptive Forms/About Me 2" },
    @{ Recursive = $TRUE; Source = "$($sourceDB):/sitecore/content/drx/IT/Content Modules/Address/default 2"; Destination = "$($destinationDB):/sitecore/content/drx/IT/Content Modules/Address/default 2" },

    @{ Recursive = $TRUE; Source = "$($sourceDB):/sitecore/content/drx/GB/Content Modules/Adaptive Forms/About Me 2"; Destination = "$($destinationDB):/sitecore/content/drx/GB/Content Modules/Adaptive Forms/About Me 2" },
    @{ Recursive = $TRUE; Source = "$($sourceDB):/sitecore/content/drx/GB/Content Modules/Address/default 2"; Destination = "$($destinationDB):/sitecore/content/drx/GB/Content Modules/Address/default 2" },

    @{ Recursive = $TRUE; Source = "$($sourceDB):/sitecore/content/drx/IE/Content Modules/Adaptive Forms/About Me 2"; Destination = "$($destinationDB):/sitecore/content/drx/IE/Content Modules/Adaptive Forms/About Me 2" },
    @{ Recursive = $TRUE; Source = "$($sourceDB):/sitecore/content/drx/IE/Content Modules/Address/default 2"; Destination = "$($destinationDB):/sitecore/content/drx/IE/Content Modules/Address/default 2" },

);

