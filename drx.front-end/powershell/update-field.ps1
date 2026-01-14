

$nodeStr = $SitecoreContextItem["node path"]
$field = $SitecoreContextItem["field name"]


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

    $str2 =  $nodeStr.Replace("US", $c)
    
    $node = Get-Item -Path "master:$($str2)"
    echo $node

    $valueNode = Get-Item -Path "master:$($SitecoreContextItem.Paths.Path)/$($c)"
    $value = $valueNode["value"]
    echo "value: $($value)" 
    
        
    $node.Editing.BeginEdit();
    $node[$($field)] = $value
    $node.Editing.EndEdit();
    
    echo $c
    
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
    
}    



function translate {
    param ($locale, $myCountry, $translatePath) 
    
    echo "translate: $($translatePath)"
    
    Add-ItemLanguage -Path $translatePath -Language "en" -TargetLanguage $locale -IfExist OverwriteLatest

    Get-ChildItem $translatePath -Recurse  |
    ForEach-Object { Add-ItemLanguage $_ -Language "en" -TargetLanguage $locale -IfExist OverwriteLatest }
}

