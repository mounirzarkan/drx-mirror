$nodePath = "/sitecore/content/drx/US/Content Modules/Adaptive Forms/About Me 2/A2/Contact Details"
$node = Get-Item -Path "master:$($nodePath)"


$countries = @(
    "AU"
)

foreach($c in $countries){
    
    echo "COUNTRY: $($c)"

    $str2 =  $nodeStr.Replace("US", $c)

    $countryNode = Get-Item -Path "master:$($str2)"
    $parent = $node.Parent
    

    #delete
    #------------

    echo "1. delete"
    $countryNode | Remove-Item -Recurse
    
    #copy
    #------------

    echo "2. copy"
    Copy-Item -Path "master:$($node.Paths.Path)" -Destination "master:$($parent.Paths.Path)" -Recurse
    $newNode = Get-Item -Path "master:$($str2)"
    

    #translate
    #------------

    echo "3. translate"

    if($c -eq "IT") {
        translate -locale "it-IT" -myCountry "it" -translatePath $str2
    }
    
    if($c -eq "FR") {
        translate -locale "fr-FR" -myCountry "fr" -translatePath $str2
    }
    
    if($c -eq "KR") {
        translate -locale "ko-KR" -myCountry "kr" -translatePath $str2
    }
    
    if($c -eq "JP") {
        translate -locale "ja-JP" -myCountry "jp" -translatePath $str2
    }

    

    #publish 
    #------------
    Publish-Item $newNode -Target "web" -PublishMode SingleItem -Language "*"
}

function translate {
    param ($locale, $myCountry, $translatePath) 
    
    echo "translate: $($translatePath)"
    
    Add-ItemLanguage -Path $translatePath -Language "en" -TargetLanguage $locale -IfExist OverwriteLatest

    Get-ChildItem $translatePath -Recurse  |
    ForEach-Object { Add-ItemLanguage $_ -Language "en" -TargetLanguage $locale -IfExist OverwriteLatest }
}