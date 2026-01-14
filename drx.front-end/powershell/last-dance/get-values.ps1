$fields = Get-ChildItem -Path "master:/sitecore/system/Automation/DRX/last dance/orders/orders"

foreach ($field in $fields) {
    
    $values = Get-ChildItem -Path $field.Paths.Path

    foreach ($value in $values) {
        echo $value["node path"]
    }

    
    
}