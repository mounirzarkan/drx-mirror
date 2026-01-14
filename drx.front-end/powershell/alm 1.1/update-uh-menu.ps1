$sourceDB="master"
$destinationDB="web"
$drxRoot="https://www2.cochlear.com"
$almRoot="https://uat.accounts.cochlear.com"

$regions = @(
    @{ Region = "us"; Lang = "en"; Locale = "en"; Texts = @{
            "About me"             = "Account Information";
            "Equipment"            = "Equipment";
            "Orders"               = "Orders";
            "Security and privacy" = "Security & Privacy";
            "Service requests"     = "Service Requests";
        }
    },
    @{ Region = "au"; Lang = "en"; Locale = "en"; Texts = @{
            "About me"             = "Account Information";
            "Equipment"            = "Equipment";
            "Orders"               = "Orders";
            "Security and privacy" = "Security & Privacy";
            "Service requests"     = "Service Requests";
        }
    },
    @{ Region = "nz"; Lang = "en"; Locale = "en"; Texts = @{
            "About me"             = "Account Information";
            "Equipment"            = "Equipment";
            "Orders"               = "Orders";
            "Security and privacy" = "Security & Privacy";
            "Service requests"     = "Service Requests";
        }
    },
    @{ Region = "ca"; Lang = "en"; Locale = "en"; Texts = @{
            "About me"             = "Account Information";
            "Equipment"            = "Equipment";
            "Orders"               = "Orders";
            "Security and privacy" = "Security & Privacy";
            "Service requests"     = "Service Requests";
        }
    },
    @{ Region = "gb"; Lang = "en"; Locale = "en"; Texts = @{
            "About me"             = "Account Information";
            "Equipment"            = "Equipment";
            "Orders"               = "Orders";
            "Security and privacy" = "Security & Privacy";
            "Service requests"     = "Service Requests";
        }
    },
    @{ Region = "ie"; Lang = "en"; Locale = "en"; Texts = @{
            "About me"             = "Account Information";
            "Equipment"            = "Equipment";
            "Orders"               = "Orders";
            "Security and privacy" = "Security & Privacy";
            "Service requests"     = "Service Requests";
        }
    },
    @{ Region = "be"; Lang = "nl"; Locale = "nl-BE"; Texts = @{
            "About me"             = "Accountinformatie";
            "Equipment"            = "Apparatuur";
            "Orders"               = "Bestellingen";
            "Security and privacy" = "Beveiliging & Privacy";
            "Service requests"     = "Serviceverzoeken";
        }
    },
    @{ Region = "be"; Lang = "fr"; Locale = "fr-BE"; Texts = @{
            "About me"             = "Informations sur le compte";
            "Equipment"            = "Équipement";
            "Orders"               = "Commandes";
            "Security and privacy" = "Sécurité & Confidentialité";
            "Service requests"     = "Demandes de Service";
        }
    },
    @{ Region = "jp"; Lang = "ja"; Locale = "ja-JP"; Texts = @{
            "About me"             = "アカウント情報";
            "Equipment"            = "機器";
            "Orders"               = "注文";
            "Security and privacy" = "セキュリティとプライバシー";
            "Service requests"     = "サービスリクエスト";
        }
    },
    @{ Region = "it"; Lang = "it"; Locale = "it-IT"; Texts = @{
            "About me"             = "Informazioni sull'account";
            "Equipment"            = "Dispositivi";
            "Orders"               = "Ordini";
            "Security and privacy" = "Sicurezza & privacy";
            "Service requests"     = "Richieste di Servizio";
        }
    },
    @{ Region = "fr"; Lang = "fr"; Locale = "fr-FR"; Texts = @{
            "About me"             = "Informations sur le compte";
            "Equipment"            = "Équipement";
            "Orders"               = "Commandes";
            "Security and privacy" = "Sécurité & Confidentialité";
            "Service requests"     = "Demandes de Service";
        }
    },
    @{ Region = "nl"; Lang = "nl"; Locale = "nl-NL"; Texts = @{
            "About me"             = "Accountinformatie";
            "Equipment"            = "Apparatuur";
            "Orders"               = "Bestellingen";
            "Security and privacy" = "Beveiliging & Privacy";
            "Service requests"     = "Serviceverzoeken";
        }
    },
    @{ Region = "kr"; Lang = "ko"; Locale = "ko-KR"; Texts = @{
            "About me"             = "계정 정보";
            "Equipment"            = "장비";
            "Orders"               = "주문";
            "Security and privacy" = "보안 및 개인정보";
            "Service requests"     = "서비스 요청";
        }
    }
)


# $links = @(
#     @{ Name = "About me"; Url = "$($almRoot)/account-management/personal-details?referer=drx" },
#     @{ Name = "Equipment"; Url = "$($drxRoot)/{0}/{1}/account/my-profile/equipment" },
#     @{ Name = "Orders"; Url = "$($drxRoot)/{0}/{1}/account/my-profile/orders" },
#     @{ Name = "Security and privacy"; Url = "$($drxRoot)/{0}/{1}/account/my-profile/security-and-privacy" },
#     @{ Name = "Service requests"; Url = "$($drxRoot)/{0}/{1}/account/my-profile/service-requests" }
# )

# ForEach ($region in $regions) {
#     ForEach ($link in $links) {
#         $path = "$($sourceDB):/sitecore/content/drx/$($region.Region)/Configuration/Header/Navigation Links/$($link.Name)"
#         $value = $link.Url -f $region.Region, $region.Lang
#         $text = $region.Texts[$link.Name]

#         $node = Get-Item -Path $path -Language $region.Locale
#         $node.Editing.BeginEdit()
#         $node["Link"] = "<link text=""$text"" linktype=""external"" url=""$value"" anchor="""" target="""" />"
#         $node.Editing.EndEdit()

#         echo "Updated: $path - $region.Locale"
#         Publish-Item $path -Target $destinationDB -PublishMode Smart -Language "*"
#         echo "Published: $path"
#     }
# }


# ForEach ($region in $regions) {
#     $path = "$($sourceDB):/sitecore/content/drx/$($region.Region)/Configuration/Header/Navigation Links/View myCochlear"
#     $parentPath = "$($sourceDB):/sitecore/content/drx/$($region.Region)/Configuration/Header/Navigation Links"
#     $node = Get-Item -Path $path

#     if ($node -ne $null) {
#         Remove-Item -Path $path -Recurse -Force
#         echo "Deleted: $path - $region.Locale"
#         Publish-Item $parentPath -Target $destinationDB -PublishMode Smart -Language "*"
#         echo "Published deletion: $path"
#     } else {
#         echo "Node not found: $path - $region.Locale"
#     }
# }


# ForEach ($region in $regions) {
#     $parentPath = "$($sourceDB):/sitecore/content/drx/$($region.Region)/Configuration/Header/Navigation Links"
    
#     Publish-Item $parentPath -Target $destinationDB -PublishMode Smart -Language "*"
#         echo "Published $parentPath"
# }

# #update the prefix url
# ForEach ($region in $regions) {
#         $path = "$($sourceDB):/sitecore/content/Cochlear-$($region.Region)/Configuration/Header/Header"

#         $node = Get-Item -Path $path -Language $region.Locale
#         $node.Editing.BeginEdit()
#         $node["COCHLEAR_DRX_MAIN"] = ""
#         $node.Editing.EndEdit()

#         echo "Updated: $path - $region.Locale"
#         Publish-Item $path -Target $destinationDB -PublishMode Smart -Language "*"
#         echo "Published: $path"

# }


# #update the prefix url
# ForEach ($region in $regions) {
#     $path ="/sitecore/content/drx/$($region.Region)/Configuration/Header/DRX Header"

#     $node = Get-Item -Path $path -Language $region.Locale
#     $node.Editing.BeginEdit()
#     $node["COCHLEAR_DRX_MAIN"] = ""
#     $node.Editing.EndEdit()

#     echo "Updated: $path - $region.Locale"
#     Publish-Item $path -Target $destinationDB -PublishMode Smart -Language "*"
#     echo "Published: $path"

# }



