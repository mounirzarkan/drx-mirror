$nodePath = "/sitecore/content/drx/US/Content Modules/Adaptive Forms/About Me 2/A1/Personal Details/edit/firstname/mask"
$node = Get-Item -Path "master:$($nodePath)"


$countries = @(
    #"AU"
    "NZ"
    "JP"
    "IT"
    "FR"
    "KR"
    "CA"
    "IE"
    "GB"
)

foreach($c in $countries){
    
    echo "COUNTRY: $($c)"

    $usNode = Get-Item -Path "master:$($nodePath)"
    
    
    $parentStr =  $usNode.Parent.Paths.Path.Replace("US", $c)
    $str2 =  $nodePath.Replace("US", $c)
    
    $parent = Get-Item -Path "master:$($parentStr)" 


    
    #copy
    #------------

    echo "1. copy"
    Copy-Item -Path "master:$($usNode.Paths.Path)" -Destination "master:$($parent.Paths.Path)" -Recurse
    $newNode = Get-Item -Path "master:$($str2)"
    

    #translate
    #------------

    echo "2. translate"

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
    echo "3. publish"
    Publish-Item $newNode -Target "web" -PublishMode SingleItem -Language "*"
}

function translate {
    param ($locale, $myCountry, $translatePath) 
    
    echo "translate: $($translatePath)"
    
    Add-ItemLanguage -Path $translatePath -Language "en" -TargetLanguage $locale -IfExist OverwriteLatest

    Get-ChildItem $translatePath -Recurse  |
    ForEach-Object { Add-ItemLanguage $_ -Language "en" -TargetLanguage $locale -IfExist OverwriteLatest }
}