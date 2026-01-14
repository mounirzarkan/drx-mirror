 

$sourceDB = "master"
$currentCountry = "KR"
$lng = "ko-KR"

# Remove Items
echo "remove items"

Remove-Item -Path "$($sourceDB):/sitecore/content/drx/$($currentCountry)/Content Modules/Address/default 2"  -Recurse
Remove-Item -Path "$($sourceDB):/sitecore/content/drx/$($currentCountry)/Content Modules/Adaptive Forms/About Me 2" -Recurse
Remove-Item -Path "$($sourceDB):/sitecore/content/drx/$($currentCountry)/my-profile/about-me" -Recurse


# copy from US
echo "copy items"


Copy-Item -Path "$($sourceDB):/sitecore/content/drx/US/Content Modules/Address/default 2" -Destination "$($sourceDB):/sitecore/content/drx/KR/Content Modules/Address/" -Recurse
Copy-Item -Path "$($sourceDB):/sitecore/content/drx/US/Content Modules/Adaptive Forms/About Me 2" -Destination "$($sourceDB):/sitecore/content/drx/KR/Content Modules/Adaptive Forms" -Recurse
Copy-Item -Path "$($sourceDB):/sitecore/content/drx/US/my-profile/about-me" -Destination    "$($sourceDB):/sitecore/content/drx/KR/my-profile" -Recurse


#remove PR nodes
echo "Delete PR nodes"
     
Get-Item -Path "master:\sitecore\content\drx\$($currentCountry)\Content Modules\Adaptive Forms\About Me 2\PR A1" | Remove-Item -Recurse
Get-Item -Path "master:\sitecore\content\drx\$($currentCountry)\Content Modules\Adaptive Forms\About Me 2\PR A2" | Remove-Item -Recurse
Get-Item -Path "master:\sitecore\content\drx\$($currentCountry)\Content Modules\Adaptive Forms\About Me 2\PR B1" | Remove-Item -Recurse
Get-Item -Path "master:\sitecore\content\drx\$($currentCountry)\Content Modules\Adaptive Forms\About Me 2\PR C1" | Remove-Item -Recurse
Get-Item -Path "master:\sitecore\content\drx\$($currentCountry)\Content Modules\Adaptive Forms\About Me 2\PR C2" | Remove-Item -Recurse
Get-Item -Path "master:\sitecore\content\drx\$($currentCountry)\Content Modules\Adaptive Forms\About Me 2\PR D1" | Remove-Item -Recurse
Get-Item -Path "master:\sitecore\content\drx\$($currentCountry)\Content Modules\Adaptive Forms\About Me 2\PR D2" | Remove-Item -Recurse


#remove PR nodes
echo "Delete middlename nodes"

Get-Item -Path "master:\sitecore\content\drx\$($currentCountry)\Content Modules\Adaptive Forms\About Me 2\A1\Personal Details\edit\middlename" | Remove-Item -Recurse
Get-Item -Path "master:\sitecore\content\drx\$($currentCountry)\Content Modules\Adaptive Forms\About Me 2\A2\Personal Details\edit\middlename" | Remove-Item -Recurse
Get-Item -Path "master:\sitecore\content\drx\$($currentCountry)\Content Modules\Adaptive Forms\About Me 2\B1\Personal Details\edit\middlename" | Remove-Item -Recurse
Get-Item -Path "master:\sitecore\content\drx\$($currentCountry)\Content Modules\Adaptive Forms\About Me 2\C1\Personal Details\edit\middlename" | Remove-Item -Recurse
Get-Item -Path "master:\sitecore\content\drx\$($currentCountry)\Content Modules\Adaptive Forms\About Me 2\D1\Personal Details\edit\middlename" | Remove-Item -Recurse

#set country to KR
echo "set country to KR"
$nodes = Get-ChildItem -Path "master:\sitecore\content\drx\$($currentCo`
foreach ($node in $nodes) {

    $node.Editing.BeginEdit();
    $node["country code"] = $currentCountry
    $node.Editing.EndEdit();

}   


# translate nodes

echo "create language version"

Add-ItemLanguage -Path "$($sourceDB):/sitecore/content/drx/$($currentCountry)/Content Modules/Address/default 2" -Language "en" -TargetLanguage "ko-KR" -IfExist OverwriteLatest -Recurse
Add-ItemLanguage -Path "$($sourceDB):/sitecore/content/drx/$($currentCountry)/Content Modules/Adaptive Forms/About Me 2" -Language "en" -TargetLanguage "ko-KR" -IfExist OverwriteLatest -Recurse
Add-ItemLanguage -Path "$($sourceDB):/sitecore/content/drx/$($currentCountry)/my-profile/about-me" -Language "en" -TargetLanguage "ko-KR" -IfExist OverwriteLatest -Recurse



# update presentation layout


# replace web
echo "replace web"

Remove-Item -Path "web:/sitecore/content/drx/$($currentCountry)/Content Modules/Address/default 2"  -Recurse
Remove-Item -Path "web:/sitecore/content/drx/$($currentCountry)/Content Modules/Adaptive Forms/About Me 2" -Recurse
Remove-Item -Path "web:/sitecore/content/drx/$($currentCountry)/my-profile/about-me" -Recurse

Publish-Item "master:/sitecore/content/drx/$($currentCountry)/Content Modules/Address/default 2" -Target "web" -PublishMode Smart -Language "*" -Recurse
Publish-Item "master:/sitecore/content/drx/$($currentCountry)/Content Modules/Adaptive Forms/About Me 2" -Target "web" -PublishMode Smart -Language "*" -Recurse
Publish-Item "master:/sitecore/content/drx/$($currentCountry)/my-profile/about-me" -Target "web" -PublishMode Smart -Language "*" -Recurse


# replace preview
echo "replace preview"

Remove-Item -Path "preview:/sitecore/content/drx/$($currentCountry)/Content Modules/Address/default 2"  -Recurse
Remove-Item -Path "preview:/sitecore/content/drx/$($currentCountry)/Content Modules/Adaptive Forms/About Me 2" -Recurse
Remove-Item -Path "preview:/sitecore/content/drx/$($currentCountry)/my-profile/about-me" -Recurse

Publish-Item "master:/sitecore/content/drx/$($currentCountry)/Content Modules/Address/default 2" -Target "preview" -PublishMode Smart -Language "*" -Recurse
Publish-Item "master:/sitecore/content/drx/$($currentCountry)/Content Modules/Adaptive Forms/About Me 2" -Target "preview" -PublishMode Smart -Language "*" -Recurse
Publish-Item "master:/sitecore/content/drx/$($currentCountry)/my-profile/about-me" -Target "preview" -PublishMode Smart -Language "*" -Recurse


#update fields
echo "update fields for AF"

$valueNode = Get-Item -Path "master:/sitecore/content/drx/$($currentCountry)/Content Modules/Adaptive Forms/About Me 2" -Language "$($lng)"
            
$valueNode.Editing.BeginEdit();
$valueNode["Save button"] =  "{4A80878D-90B6-4BA7-B2B2-58DEA3B4393C}"
$valueNode["Cancel button"] = "{3709233A-6FEF-4176-B6C4-19370AF8D962}"
$valueNode["Edit link"] = "{C8552791-FB9E-4892-877F-D1B91D7B4201}"
$valueNode["Cancel link"] = "{60534E1E-4B5B-472A-8EE5-FBEBDD1B7685}"
$valueNode["Create icon"] = "add"
$valueNode["Create link"] = "{E4E93624-A693-4901-B4DE-9618A38B8EEA}"
$valueNode["Edit icon"] = "edit"
$valueNode.Editing.EndEdit();

Publish-Item $valueNode.Paths.Path -Target "web" -PublishMode Smart -Language "*" -Recurse
Publish-Item $valueNode.Paths.Path -Target "preview" -PublishMode Smart -Language "*" -Recurse


    








 