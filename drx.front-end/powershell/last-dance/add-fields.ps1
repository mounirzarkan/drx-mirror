
$fields = Get-ChildItem -Path "master:/sitecore/system/Automation/DRX/last dance/orders/orders"

foreach ($field in $fields) {
    
    echo $field

    $values = Get-ChildItem -Path $field.Paths.Path

    foreach ($value in $values) {
        $value | Remove-Item -Recurse
    }

    
    New-Item -Path $field.Paths.Path -Name "KO"     -ItemType "{5C25F45E-E53F-4D1A-A725-8C1530BF8416}"
    New-Item -Path $field.Paths.Path -Name "NL"     -ItemType "{5C25F45E-E53F-4D1A-A725-8C1530BF8416}"
    New-Item -Path $field.Paths.Path -Name "BE-NL"  -ItemType "{5C25F45E-E53F-4D1A-A725-8C1530BF8416}"
    New-Item -Path $field.Paths.Path -Name "BE-FR"  -ItemType "{5C25F45E-E53F-4D1A-A725-8C1530BF8416}"

}