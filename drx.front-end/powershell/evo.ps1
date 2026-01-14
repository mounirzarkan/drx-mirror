echo $SitecoreContextItem["file"]
$media = Get-Item -Path $SitecoreContextItem["file"]

# get stream and save content to variable $content
[System.IO.Stream]$body = $media.Fields["Blob"].GetBlobStream()


try    
{
    $contents = New-Object byte[] $body.Length
    $body.Read($contents, 0, $body.Length) | Out-Null
} 
finally 
{
    $body.Close()    
}

# convert to dynamic object
$csv = [System.Text.Encoding]::Default.GetString($contents) | ConvertFrom-Csv -Delimiter ","


foreach($line in $csv)
{
    $properties = $line | Get-Member -MemberType Properties
    for($i=0; $i -lt $properties.Count;$i++)
    {
        
        $column = $properties[$i]
        $columnvalue = $line | Select -ExpandProperty $column.Name

        
        if($column.Name -eq "id"){
            $id = $columnvalue
        }

        if($column.Name -eq "title"){
            $title = $columnvalue
        }

        if($column.Name -eq "description"){
            $description = $columnvalue
        }

        if($column.Name -eq "content"){
            $content = $columnvalue
        }

        if($column.Name -eq "date"){
            $date = $columnvalue
        }

        if($column.Name -eq "imageUrl"){
            $imageUrl = $columnvalue
        }

        if($column.Name -eq "category"){
            $category = $columnvalue
        }

        if($column.Name -eq "uri"){
            $uri = $columnvalue
        }


    }
    echo "$($stateCode) - $($stateName)"

    New-Item -Path "master:$($SitecoreContextItem.Paths.Path)\$($category)" -Name $uri -ItemType "/sitecore/templates/Project/CDS/Regions/Single region"
    $item = Get-Item -Path "master:$($SitecoreContextItem.Paths.Path)\$($category)\$($uri)"
    
    $item.Editing.BeginEdit();
    
    $item["Title"] = $title;
    $item["Description"] = $description;
    $item["Content"] = $content;
    
    $item.Editing.EndEdit();
}