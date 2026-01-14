
$sourceDB = "master"
$destinationDB = "preview"


$Items = @(

    @{ Recursive = $TRUE; Source = "$($sourceDB):/sitecore/content/drx/test delete"}

);
 
$moveForward = Show-Confirm -Title "have you double checked everything you dumb dumb ! "

if($moveForward -eq "yes") {
  
    ForEach ($Item in $Items)
    {
        $exists = Test-Path  $Item.Source

        if ($exists -eq $TRUE)
        {

            if($item.Recursive -eq $TRUE){
                Publish-Item $Item.Source -Target $destinationDB -PublishMode Smart -Language "*" -Recurse
                echo "publish to $($destinationDB) (recurse): $($Item.Source) "
            }
            else{
                Publish-Item $Item.Source -Target $destinationDB -PublishMode Smart -Language "*"
                echo "publish to $($destinationDB): $($Item.Source) "
            }
        }
        else{
        echo "doestn't exist: $($Item.Source)"
        }


    }
 
}