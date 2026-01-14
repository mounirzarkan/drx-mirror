
$sourceDB = "master"

$Items = @(

    @{ Recursive = $TRUE; Source = "$($sourceDB):/sitecore/layout/Renderings/Project/DRX/Content"}

);
 
 
 
ForEach ($Item in $Items)
{
    $exists = Test-Path  $Item.Source

    if ($exists -eq $TRUE)
    {
        echo "exists: $($Item.Source)"
    }
    else{
       echo "doestn't exist: $($Item.Source)"
    }


}
 
