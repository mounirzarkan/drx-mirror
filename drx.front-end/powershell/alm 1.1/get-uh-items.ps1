$sourceDB = "master"
$destinationDB = "web"
$drxRoot = "https://dmsit.cx.nonp.cochlear.cloud"

$regions = @(
    @{ Region = "us"; Lang = "en"; Texts = @{
            "About me"             = "Account Information";
            "Equipment"            = "My Equipment";
            "Orders"               = "My Orders";
            "Security and privacy" = "Security & Privacy";
            "Service requests"     = "Service Requests";
        }
    },
    @{ Region = "au"; Lang = "en"; Texts = @{
            "About me"             = "Account Information";
            "Equipment"            = "My Equipment";
            "Orders"               = "My Orders";
            "Security and privacy" = "Security & Privacy";
            "Service requests"     = "Service Requests";
        }
    },
    @{ Region = "nz"; Lang = "en"; Texts = @{
            "About me"             = "Account Information";
            "Equipment"            = "My Equipment";
            "Orders"               = "My Orders";
            "Security and privacy" = "Security & Privacy";
            "Service requests"     = "Service Requests";
        }
    },
    @{ Region = "ca"; Lang = "en"; Texts = @{
            "About me"             = "Account Information";
            "Equipment"            = "My Equipment";
            "Orders"               = "My Orders";
            "Security and privacy" = "Security & Privacy";
            "Service requests"     = "Service Requests";
        }
    },
    @{ Region = "gb"; Lang = "en"; Texts = @{
            "About me"             = "Account Information";
            "Equipment"            = "My Equipment";
            "Orders"               = "My Orders";
            "Security and privacy" = "Security and Privacy";
            "Service requests"     = "Service Requests";
        }
    },
    @{ Region = "ie"; Lang = "en"; Texts = @{
            "About me"             = "About Me";
            "Equipment"            = "My Equipment";
            "Orders"               = "My Orders";
            "Security and privacy" = "Security and Privacy";
            "Service requests"     = "Service Requests";
        }
    },
    @{ Region = "be"; Lang = "en"; Texts = @{
            "About me"             = "Over Mij";
            "Equipment"            = "Apparatuur";
            "Orders"               = "Bestellingen";
            "Security and privacy" = "Beveiliging en Privacy";
            "Service requests"     = "Serviceverzoeken";
        }
    },
    @{ Region = "be"; Lang = "en"; Texts = @{
            "About me"             = "À Propos";
            "Equipment"            = "Équipement";
            "Orders"               = "Commandes";
            "Security and privacy" = "Sécurité e Confidentialité";
            "Service requests"     = "Demandes de Service";
        }
    },
    @{ Region = "jp"; Lang = "en"; Texts = @{
            "About me"             = "私の個人情報";
            "Equipment"            = "機器";
            "Orders"               = "注文";
            "Security and privacy" = "セキュリティとプライバシー";
            "Service requests"     = "サービスリクエスト";
        }
    },
    @{ Region = "it"; Lang = "en"; Texts = @{
            "About me"             = "Informazioni personali";
            "Equipment"            = "Dispositivi";
            "Orders"               = "Ordini";
            "Security and privacy" = "Sicurezza e privacy";
            "Service requests"     = "Richieste di Servizio";
        }
    },
    @{ Region = "fr"; Lang = "en"; Texts = @{
            "About me"             = "À Propos";
            "Equipment"            = "Équipement";
            "Orders"               = "Commandes";
            "Security and privacy" = "Sécurité e Confidentialité";
            "Service requests"     = "Demandes de Service";
        }
    },
    @{ Region = "nl"; Lang = "en"; Texts = @{
            "About me"             = "Over Mij";
            "Equipment"            = "Apparatuur";
            "Orders"               = "Bestellingen";
            "Security and privacy" = "Beveiliging en Privacy";
            "Service requests"     = "Serviceverzoeken";
        }
    },
    @{ Region = "kr"; Lang = "en"; Texts = @{
            "About me"             = "내 정보";
            "Equipment"            = "장비";
            "Orders"               = "주문";
            "Security and privacy" = "보안 및 개인정보";
            "Service requests"     = "서비스 요청";
        }
    }
)

$links = @(
    @{ Name = "About me"; Url = "https://sit.accounts.cochlear.com/account-management/personal-details?referer=drx" },
    @{ Name = "Equipment"; Url = "$($drxRoot)/{0}/{1}/account/my-profile/equipment" },
    @{ Name = "Orders"; Url = "$($drxRoot)/{0}/{1}/account/my-profile/orders" },
    @{ Name = "Security and privacy"; Url = "$($drxRoot)/{0}/{1}/account/my-profile/security-and-privacy" },
    @{ Name = "Service requests"; Url = "https://dmsit.cx.nonp.cochlear.cloud/{0}/{1}/account/my-profile/service-requests" }
)

ForEach ($region in $regions) {
    echo "Region: $($region.Region) Lang: $($region.Lang)"
    echo "-----------------------------------------"

    ForEach ($link in $links) {

        
        $path = "$($sourceDB):/sitecore/content/drx/$($region.Region)/Configuration/Header/Navigation Links/$($link.Name)"
        $value = $link.Url -f $region.Region, $region.Lang
        $text = $region.Texts[$link.Name]

        $node = Get-Item -Path $path -Language $region.Lang
        echo $node $node["Link"]
       
    }
}
