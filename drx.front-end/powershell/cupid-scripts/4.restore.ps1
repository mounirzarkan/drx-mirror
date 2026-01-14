
$sourceDB = "web"
$destinationDB ="preview"

$Items = @(

    @{ Recursive = $TRUE; Source= "$($sourceDB):/sitecore/content/drx/test delete/test 1"; Destination= "$($destinationDB):/sitecore/content/drx/test delete" }
);
 
 
$moveForward = Show-Confirm -Title "have you double checked everything you dumb dumb ! "

if($moveForward -eq "yes") {
 
    ForEach ($Item in $Items)
    {
        
        # Add -PassThru to output the new item
        if($item.Recursive){
        Copy-Item -Path $Item.Source -Destination $Item.Destination -Recurse
        }
        else{
        Copy-Item -Path $Item.Source -Destination $Item.Destination

        }
        
        echo "restore to $($destinationDB): $($Item.Source)"

    }
 
}