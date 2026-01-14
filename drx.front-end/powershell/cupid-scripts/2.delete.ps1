
$sourceDB = "master"

$Items = @(

    @{ Recursive = $TRUE; Source = "$($sourceDB):/sitecore/layout/Renderings/Project/DRX/Content"}

);
 
$moveForward = Show-Confirm -Title "have you double checked everything you dumb dumb ! "

if($moveForward -eq "yes") {

 
    ForEach ($Item in $Items)
    {
        $exists = Test-Path  $Item.Source

        if ($exists -eq $TRUE)
        {
            if($item.Recursive -eq $TRUE){
                Remove-Item -Path $Item.Source -Recurse
                echo "delete (recursive): $($Item.Source) "
            }
            else{
                Remove-Item -Path $Item.Source -Recurse
                echo "delete: $($Item.Source)"

            }
        }
        else{
        echo "doestn't exist: $($Item.Source)"
        }


    }

}
 
