

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

        
        if($column.Name -eq "field1"){
            $stateCode = $columnvalue
        }

        if($column.Name -eq "field2"){
            $stateName = $columnvalue
        }
    }
    echo "$($stateCode) - $($stateName)"

    New-Item -Path $SitecoreContextItem.Paths.Path -Name $stateCode -ItemType "/sitecore/templates/Project/CDS/Regions/Single region"
    $item = Get-Item -Path "master:$($SitecoreContextItem.Paths.Path)\$($stateCode)"
    $item.Editing.BeginEdit();
    $item["code"] = $stateCode;
    $item["name"] = $stateName;
    $item.Editing.EndEdit();
} 
