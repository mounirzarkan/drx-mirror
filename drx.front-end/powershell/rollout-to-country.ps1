function copyTo(){
    echo "rollout - $($SitecoreContextItem["node to rollout"])"

    $baselineCountryNode = Get-Item -Path $SitecoreContextItem["node to rollout"]  #Get-Item -Path "/sitecore/content/drx/US/Content Modules/Adaptive Forms/About Me 3"
    $baseLineCountryName = "US"

    $countriesToRollout = $SitecoreContextItem["countries to rollout to"].split("|")

    foreach ($c in $countriesToRollout) {
        
        #country
        $countryNode= Get-Item -Path "master:" -ID $c
        $country =  $countryNode.Name

        echo "country: $($country)"

        # if exists delete
        $newCopyParentPath = $baselineCountryNode.Parent.Paths.Path.Replace($baseLineCountryName, $country)
        $newCopyPath = $baselineCountryNode.Paths.Path.Replace($baseLineCountryName, $country)
        
        $itemExists = Test-Path -Path $newCopyPath

        if($itemExists){
            echo "DELETE ITEM"
            Get-Item -Path $newCopyPath | Remove-Item -Recurse
        }

        # copy to each country
        echo "COPY ITEM"
        Copy-Item -Path "master:$($baselineCountryNode.Paths.Path)" -Destination "master:$($newCopyParentPath)" -Recurse
        
        
        replaceFields -fields $SitecoreContextItem.Children  -baseLineCountry $baseLineCountryName -currentCountry $country
        
        if($SitecoreContextItem.Name -eq "Adaptive Forms"){
            deletePRnodes -currentCountry $country    
            deletemiddleName -currentCountry $country
        }
        
        if($country -eq "IT") {
            translate -locale "it-IT" -myCountry "it"
        }
        
        if($country -eq "FR") {
            translate -locale "fr-FR" -myCountry "fr"
        }
        
        if($country -eq "KR") {
            translate -locale "ko-KR" -myCountry "kr"
        }
        
        if($country -eq "JP") {
            translate -locale "ja-JP" -myCountry "jp"
        }
        
        
    }

}

function replaceFields{

    param ( $fields, $baseLineCountry, $currentCountry) 
    
    
    foreach ($field in $fields) {

        $fieldNodePath = $field["node path"]
        $fieldName = $field["field name"]
        
        $newFieldNodePath = $fieldNodePath.Replace($baseLineCountry, $currentCountry);

        $newFieldNode = Get-Item -Path $newFieldNodePath

        $valueNode = Get-Item  -Path "$($field.Paths.Path)/$($currentCountry)"
        $value = $valueNode["value"];

      echo "set value: $($newFieldNode.Paths.Path)  $($fieldName) - $($value)"
      
        $newFieldNode.Editing.BeginEdit();
        $newFieldNode[$fieldName] = $value
        $newFieldNode.Editing.EndEdit();

    }   

}


function deletePRnodes {
     param ($currentCountry) 
     echo "Delete PR nodes"
     
     Get-Item -Path "master:\sitecore\content\drx\$($currentCountry)\Content Modules\Adaptive Forms\About Me 2\PR A1" | Remove-Item -Recurse
     Get-Item -Path "master:\sitecore\content\drx\$($currentCountry)\Content Modules\Adaptive Forms\About Me 2\PR A2" | Remove-Item -Recurse
     Get-Item -Path "master:\sitecore\content\drx\$($currentCountry)\Content Modules\Adaptive Forms\About Me 2\PR B1" | Remove-Item -Recurse
     Get-Item -Path "master:\sitecore\content\drx\$($currentCountry)\Content Modules\Adaptive Forms\About Me 2\PR C1" | Remove-Item -Recurse
     Get-Item -Path "master:\sitecore\content\drx\$($currentCountry)\Content Modules\Adaptive Forms\About Me 2\PR C2" | Remove-Item -Recurse
     Get-Item -Path "master:\sitecore\content\drx\$($currentCountry)\Content Modules\Adaptive Forms\About Me 2\PR D1" | Remove-Item -Recurse
     Get-Item -Path "master:\sitecore\content\drx\$($currentCountry)\Content Modules\Adaptive Forms\About Me 2\PR D2" | Remove-Item -Recurse
}

function deletemiddleName {
     param ($currentCountry) 
     echo "Delete middlename nodes"
     
     Get-Item -Path "master:\sitecore\content\drx\$($currentCountry)\Content Modules\Adaptive Forms\About Me 2\A1\Personal Details\edit\middlename" | Remove-Item -Recurse
     Get-Item -Path "master:\sitecore\content\drx\$($currentCountry)\Content Modules\Adaptive Forms\About Me 2\A2\Personal Details\edit\middlename" | Remove-Item -Recurse
     Get-Item -Path "master:\sitecore\content\drx\$($currentCountry)\Content Modules\Adaptive Forms\About Me 2\B1\Personal Details\edit\middlename" | Remove-Item -Recurse
     Get-Item -Path "master:\sitecore\content\drx\$($currentCountry)\Content Modules\Adaptive Forms\About Me 2\C1\Personal Details\edit\middlename" | Remove-Item -Recurse
     Get-Item -Path "master:\sitecore\content\drx\$($currentCountry)\Content Modules\Adaptive Forms\About Me 2\D1\Personal Details\edit\middlename" | Remove-Item -Recurse
}


function translate {
    param ($locale, $myCountry) 
    
    $translatePath = $SitecoreContextItem["node to rollout"].Replace("US", $myCountry)    
    echo "translate: $($translatePath)" 

    Add-ItemLanguage -Path $translatePath -Language "en" -TargetLanguage $locale -IfExist OverwriteLatest

    Get-ChildItem $translatePath -Recurse  |
    ForEach-Object { Add-ItemLanguage $_ -Language "en" -TargetLanguage $locale -IfExist OverwriteLatest }
}

copyTo

