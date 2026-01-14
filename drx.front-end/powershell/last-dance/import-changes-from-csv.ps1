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

#1. get values for each country

foreach($line in $csv)
{
    
    $properties = $line | Get-Member -MemberType Properties
    
    $id = ''
    $node= '' 
    $kr=''
    $nl=''
    $be_nl=''
    $be_fr=''
    
    for($i=0; $i -lt $properties.Count;$i++)
    {
        
        $column = $properties[$i]
        $columnvalue = $line | Select -ExpandProperty $column.Name
                
        if($column.Name.Contains("id")){
            $id = $columnvalue.Replace("'","")
        }

        if($column.Name -eq "node"){
            $node = $columnvalue
        }

        if($column.Name -eq "field"){
            $field = $columnvalue
        }

        if($column.Name -eq "KR"){
            $kr = $columnvalue
        }

        if($column.Name -eq "NL"){
            $nl = $columnvalue
        }

        if($column.Name -eq "BE-NL"){
            $be_nl = $columnvalue
        }
        
        if($column.Name -eq "BE-FR"){
            $be_fr = $columnvalue
        }

    }
    
    
    Write-Host "x_$($id)_$($field): item(path: '$($node)' language: 'en') {
        value: field(name:'$($field)'){
            value
        }
    }"
    
    if($id){
        

        $nodeName = "$($id) - $($field)"
        $creatLoc = $SitecoreContextItem.Paths.Path 
        

        # # create replace field node
        # New-Item -Path $creatLoc -Name $nodeName -ItemType "{1945D268-59F0-4077-AB14-C153B73043A6}"
        # $replace_node = Get-Item -Path "$($creatLoc)/$nodeName"
        # $replace_node.Editing.BeginEdit();
        # $replace_node["node path"] = $node;
        # $replace_node["field name"] = $field;
        # $replace_node.Editing.EndEdit();


        # # create KR value node
        # New-Item -Path "$($creatLoc)/$($nodeName)" -Name "KR" -ItemType "{5C25F45E-E53F-4D1A-A725-8C1530BF8416}"
        # $kr_node = Get-Item -Path "$($creatLoc)/$nodeName/KR"
        # $kr_node.Editing.BeginEdit();
        # $kr_node["value"] = $kr;
        # $kr_node.Editing.EndEdit();


        # # create NL value node
        # New-Item -Path "$($creatLoc)/$($nodeName)" -Name "NL" -ItemType "{5C25F45E-E53F-4D1A-A725-8C1530BF8416}"
        # $nl_node = Get-Item -Path "$($creatLoc)/$nodeName/NL"
        # $nl_node.Editing.BeginEdit();
        # $nl_node["value"] = $nl;
        # $nl_node.Editing.EndEdit();


        # # create BE-NL value node
        # New-Item -Path "$($creatLoc)/$($nodeName)" -Name "BE-NL" -ItemType "{5C25F45E-E53F-4D1A-A725-8C1530BF8416}"
        # $benl_node = Get-Item -Path "$($creatLoc)/$nodeName/BE-NL"
        # $benl_node.Editing.BeginEdit();
        # $benl_node["value"] = $be_nl;
        # $benl_node.Editing.EndEdit();


        # # create BE-FR value node
        # New-Item -Path "$($creatLoc)/$($nodeName)" -Name "BE-FR" -ItemType "{5C25F45E-E53F-4D1A-A725-8C1530BF8416}"
        # $befr_node = Get-Item -Path "$($creatLoc)/$nodeName/BE-FR"
        # $befr_node.Editing.BeginEdit();
        # $befr_node["value"] = $be_fr;
        # $befr_node.Editing.EndEdit();


        # #New-Item -Path $creatLoc -Name $stateCode -ItemType "/sitecore/templates/Project/CDS/Regions/Single region"
        # # $item = Get-Item -Path "master:$($creatLoc)\$($stateCode)"
        # # $item.Editing.BeginEdit();
        # # $item["code"] = $stateCode;
        # # $item["name"] = $stateName;
        # # $item.Editing.EndEdit();

    }
    
    
} 
