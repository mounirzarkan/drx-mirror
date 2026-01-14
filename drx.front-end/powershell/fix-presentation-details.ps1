
$pages= @(
    "about-me"    
    "orders"
    "equipment"
    "security-and-privacy"
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

foreach($page in $pages){

    foreach($c in $countries){

        $str2 = "/sitecore/content/drx/$($c)/my-profile/$($page)"  
        
        
        if($c -eq "IT") {
            translate -locale "it-IT"  -translatePath $str2
        }
            
        if($c -eq "FR") {
            translate -locale "fr-FR"  -translatePath $str2
        }
            
        if($c -eq "KR") {
            translate -locale "ko-KR"  -translatePath $str2
        }
            
        if($c -eq "JP") {
            translate -locale "ja-JP"  -translatePath $str2
        }

    }
}

function translate {
    param ($locale, $translatePath) 

    Add-ItemLanguage -Path $translatePath -Language "en" -TargetLanguage $locale -IfExist OverwriteLatest
}
