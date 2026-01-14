$sourceDB = "master"


$Items = @(

    @{ Recursive = $TRUE; Source = "master:/sitecore/content/drx/US/my-profile/about-me"; Countries=@('BE'); CopyRendering=1}
    @{ Recursive = $TRUE; Source = "master:/sitecore/content/drx/US/my-profile/equipment"; Countries=@('BE'); CopyRendering=1}
    @{ Recursive = $TRUE; Source = "master:/sitecore/content/drx/US/my-profile/orders"; Countries=@('BE'); CopyRendering=1}
);
 
 
function translate {
    param ($locale, $myCountry, $translatePath) 
        
    Add-ItemLanguage -Path $translatePath -Language "en" -TargetLanguage $locale -IfExist OverwriteLatest

    Get-ChildItem $translatePath -Recurse  |
    ForEach-Object { Add-ItemLanguage $_ -Language "en" -TargetLanguage $locale -IfExist OverwriteLatest }
}

function copyRendering {
    param ($locale, $myCountry, $translatePath) 
    
    $page = Get-Item -Path $($translatePath)

    $renderingsText = $page["__Renderings"] 
    
    $page.Editing.BeginEdit();
    $page["__Final Renderings"]=$renderingsText
    $page.Editing.EndEdit();
    
}
 
ForEach ($Item in $Items)
{
    ForEach ($country in $Item.countries)
    {
        $str2 =  $Item.Source.Replace("US", $country)
        $node = Get-Item -Path $str2
        Publish-Item $node -Target "web" -PublishMode SingleItem -Language "*" -Recurse
        echo "publish: $($str2)"
    }
}


 
ForEach ($Item in $Items)
{
    ForEach ($country in $Item.countries)
    {
        


        echo "$($Item.Source):  $($country)"
        
        # copy node

        $str2 =  $Item.Source.Replace("US", $country)

        $itemExists = Test-Path -Path $str2

        if($itemExists){
            echo "DELETE ITEM"
            Get-Item -Path $str2 | Remove-Item -Recurse
        }

        $sourceNode = Get-Item -Path $Item.Source
        $parentPath = $sourceNode.Parent.Paths.Path.Replace("US", $country)
        $parent = Get-Item -Path $parentPath
        
        Copy-Item -Path "master:$($sourceNode.Paths.Path)" -Destination "master:$($parent.Paths.Path)" -Recurse
        $newNode = Get-Item -Path $str2

        
        echo "1. copy"
        echo $newNode

        # translate node

        if($country -eq "NL") {
            translate -locale "nl-NL" -myCountry "nl" -translatePath $str2
        }

        if($country -eq "BE") {
            translate -locale "nl-BE" -myCountry "be" -translatePath $str2
            translate -locale "fr-BE" -myCountry "be" -translatePath $str2
        }

        if($country -eq "IT") {
            translate -locale "it-IT" -myCountry "it" -translatePath $str2
        }
        
        if($country -eq "FR") {
            translate -locale "fr-FR" -myCountry "fr" -translatePath $str2
        }
        
        if($country -eq "KR") {
            translate -locale "ko-KR" -myCountry "kr" -translatePath $str2
        }
        
        if($country -eq "JP") {
            translate -locale "ja-JP" -myCountry "jp" -translatePath $str2
        }
        
        echo "2. translate"

        
        #publish 
        #------------
        Publish-Item $newNode -Target "web" -PublishMode SingleItem -Language "*"
        echo "3. publish"


        # copy rendering
        if($item.CopyRendering -eq 1){
            # translate node

            if($country -eq "IT") {
                copyRendering -locale "it-IT" -myCountry "it" -translatePath $str2
            }
            
            if($country -eq "FR") {
                copyRendering -locale "fr-FR" -myCountry "fr" -translatePath $str2
            }
            
            if($country -eq "KR") {
                copyRendering -locale "ko-KR" -myCountry "kr" -translatePath $str2
            }
            
            if($country -eq "JP") {
                copyRendering -locale "ja-JP" -myCountry "jp" -translatePath $str2
            }
         
            if($country -eq "NL") {
                copyRendering -locale "nl-NL" -myCountry "jp" -translatePath $str2
            }

            if($country -eq "BE") {
                copyRendering -locale "nl-BE" -myCountry "be" -translatePath $str2
                copyRendering -locale "fr-BE" -myCountry "be" -translatePath $str2
            }

            echo "4. copy rendering"

        }

        
        
    }    
}
