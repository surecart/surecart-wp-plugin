#!/bin/bash

# Create directory if it doesn't exist
mkdir -p images/flags

# Function to download flag
download_flag() {
    country_code=$1
    currency_code=$2
    url="https://raw.githubusercontent.com/lipis/flag-icons/main/flags/4x3/${country_code}.svg"
    echo "Downloading flag for ${currency_code} (${country_code})"
    curl -s -o "images/flags/${currency_code}.svg" "${url}"
}

# Download flags for each currency
download_flag "al" "all"  # Albania
download_flag "dz" "dzd"  # Algeria
download_flag "ao" "aoa"  # Angola
download_flag "ar" "ars"  # Argentina
download_flag "am" "amd"  # Armenia
download_flag "aw" "awg"  # Aruba
download_flag "au" "aud"  # Australia
download_flag "az" "azn"  # Azerbaijan
download_flag "bs" "bsd"  # Bahamas
download_flag "bd" "bdt"  # Bangladesh
download_flag "bb" "bbd"  # Barbados
download_flag "by" "byn"  # Belarus
download_flag "bz" "bzd"  # Belize
download_flag "bm" "bmd"  # Bermuda
download_flag "bo" "bob"  # Bolivia
download_flag "ba" "bam"  # Bosnia and Herzegovina
download_flag "bw" "bwp"  # Botswana
download_flag "br" "brl"  # Brazil
download_flag "gb" "gbp"  # United Kingdom
download_flag "bn" "bnd"  # Brunei
download_flag "bg" "bgn"  # Bulgaria
download_flag "bi" "bif"  # Burundi
download_flag "kh" "khr"  # Cambodia
download_flag "ca" "cad"  # Canada
download_flag "cv" "cve"  # Cape Verde
download_flag "ky" "kyd"  # Cayman Islands
download_flag "cf" "xaf"  # Central African Republic
download_flag "pf" "xpf"  # French Polynesia
download_flag "cl" "clp"  # Chile
download_flag "cn" "cny"  # China
download_flag "co" "cop"  # Colombia
download_flag "km" "kmf"  # Comoros
download_flag "cd" "cdf"  # DR Congo
download_flag "cr" "crc"  # Costa Rica
download_flag "hr" "hrk"  # Croatia
download_flag "cz" "czk"  # Czech Republic
download_flag "dk" "dkk"  # Denmark
download_flag "dj" "djf"  # Djibouti
download_flag "do" "dop"  # Dominican Republic
download_flag "ag" "xcd"  # Eastern Caribbean
download_flag "eg" "egp"  # Egypt
download_flag "et" "etb"  # Ethiopia
download_flag "eu" "eur"  # European Union
download_flag "fk" "fkp"  # Falkland Islands
download_flag "fj" "fjd"  # Fiji
download_flag "gm" "gmd"  # Gambia
download_flag "ge" "gel"  # Georgia
download_flag "gh" "ghs"  # Ghana
download_flag "gi" "gip"  # Gibraltar
download_flag "gt" "gtq"  # Guatemala
download_flag "gn" "gnf"  # Guinea
download_flag "gy" "gyd"  # Guyana
download_flag "ht" "htg"  # Haiti
download_flag "hn" "hnl"  # Honduras
download_flag "hk" "hkd"  # Hong Kong
download_flag "hu" "huf"  # Hungary
download_flag "is" "isk"  # Iceland
download_flag "in" "inr"  # India
download_flag "id" "idr"  # Indonesia
download_flag "il" "ils"  # Israel
download_flag "jm" "jmd"  # Jamaica
download_flag "jp" "jpy"  # Japan
download_flag "kz" "kzt"  # Kazakhstan
download_flag "ke" "kes"  # Kenya
download_flag "kg" "kgs"  # Kyrgyzstan
download_flag "la" "lak"  # Laos
download_flag "lb" "lbp"  # Lebanon
download_flag "ls" "lsl"  # Lesotho
download_flag "lr" "lrd"  # Liberia
download_flag "mo" "mop"  # Macau
download_flag "mk" "mkd"  # North Macedonia
download_flag "mw" "mwk"  # Malawi
download_flag "my" "myr"  # Malaysia
download_flag "mv" "mvr"  # Maldives
download_flag "mr" "mro"  # Mauritania
download_flag "mu" "mur"  # Mauritius
download_flag "mx" "mxn"  # Mexico
download_flag "md" "mdl"  # Moldova
download_flag "mn" "mnt"  # Mongolia
download_flag "ma" "mad"  # Morocco
download_flag "mz" "mzn"  # Mozambique
download_flag "mm" "mmk"  # Myanmar
download_flag "na" "nad"  # Namibia
download_flag "np" "npr"  # Nepal
download_flag "an" "ang"  # Netherlands Antilles
download_flag "tw" "twd"  # Taiwan
download_flag "nz" "nzd"  # New Zealand
download_flag "ni" "nio"  # Nicaragua
download_flag "ng" "ngn"  # Nigeria
download_flag "no" "nok"  # Norway
download_flag "pk" "pkr"  # Pakistan
download_flag "pa" "pab"  # Panama
download_flag "pg" "pgk"  # Papua New Guinea
download_flag "py" "pyg"  # Paraguay
download_flag "pe" "pen"  # Peru
download_flag "ph" "php"  # Philippines
download_flag "pl" "pln"  # Poland
download_flag "qa" "qar"  # Qatar
download_flag "ro" "ron"  # Romania
download_flag "ru" "rub"  # Russia
download_flag "rw" "rwf"  # Rwanda
download_flag "sh" "shp"  # Saint Helena
download_flag "ws" "wst"  # Samoa
download_flag "sa" "sar"  # Saudi Arabia
download_flag "rs" "rsd"  # Serbia
download_flag "sc" "scr"  # Seychelles
download_flag "sl" "sll"  # Sierra Leone
download_flag "sg" "sgd"  # Singapore
download_flag "sb" "sbd"  # Solomon Islands
download_flag "so" "sos"  # Somalia
download_flag "za" "zar"  # South Africa
download_flag "kr" "krw"  # South Korea
download_flag "lk" "lkr"  # Sri Lanka
download_flag "sr" "srd"  # Suriname
download_flag "sz" "szl"  # Eswatini
download_flag "se" "sek"  # Sweden
download_flag "ch" "chf"  # Switzerland
download_flag "st" "std"  # São Tomé and Príncipe
download_flag "tj" "tjs"  # Tajikistan
download_flag "tz" "tzs"  # Tanzania
download_flag "th" "thb"  # Thailand
download_flag "to" "top"  # Tonga
download_flag "tt" "ttd"  # Trinidad and Tobago
download_flag "tr" "try"  # Turkey
download_flag "ug" "ugx"  # Uganda
download_flag "ua" "uah"  # Ukraine
download_flag "ae" "aed"  # United Arab Emirates
download_flag "us" "usd"  # United States
download_flag "uy" "uyu"  # Uruguay
download_flag "uz" "uzs"  # Uzbekistan
download_flag "vu" "vuv"  # Vanuatu
download_flag "vn" "vnd"  # Vietnam
download_flag "sn" "xof"  # West African CFA
download_flag "ye" "yer"  # Yemen
download_flag "zm" "zmw"  # Zambia
download_flag "tn" "tnd"  # Tunisia

echo "All flags have been downloaded!"
