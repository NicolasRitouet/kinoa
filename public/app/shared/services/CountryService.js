'use strict';

angular.module('KinoaApp')
    .factory('CountryService', function () {
        var countryList = [
            {
                "iso": "AF",
                "name": "Afghanistan"
            },
            {
                "iso": "ZA",
                "name": "Afrique du Sud"
            },
            {
                "iso": "AL",
                "name": "Albanie"
            },
            {
                "iso": "DZ",
                "name": "Algérie"
            },
            {
                "iso": "DE",
                "name": "Allemagne"
            },
            {
                "iso": "AD",
                "name": "Andorre"
            },
            {
                "iso": "AO",
                "name": "Angola"
            },
            {
                "iso": "AI",
                "name": "Anguilla"
            },
            {
                "iso": "AQ",
                "name": "Antarctique"
            },
            {
                "iso": "AG",
                "name": "Antigua-et-Barbuda"
            },
            {
                "iso": "AN",
                "name": "Antilles néerlandaises"
            },
            {
                "iso": "SA",
                "name": "Arabie saoudite"
            },
            {
                "iso": "AR",
                "name": "Argentine"
            },
            {
                "iso": "AM",
                "name": "Arménie"
            },
            {
                "iso": "AW",
                "name": "Aruba"
            },
            {
                "iso": "AU",
                "name": "Australie"
            },
            {
                "iso": "AT",
                "name": "Autriche"
            },
            {
                "iso": "AZ",
                "name": "Azerbaïdjan"
            },
            {
                "iso": "BS",
                "name": "Bahamas"
            },
            {
                "iso": "BH",
                "name": "Bahreïn"
            },
            {
                "iso": "BD",
                "name": "Bangladesh"
            },
            {
                "iso": "BB",
                "name": "Barbade"
            },
            {
                "iso": "BE",
                "name": "Belgique"
            },
            {
                "iso": "BZ",
                "name": "Belize"
            },
            {
                "iso": "BM",
                "name": "Bermudes"
            },
            {
                "iso": "BT",
                "name": "Bhoutan"
            },
            {
                "iso": "BO",
                "name": "Bolivie"
            },
            {
                "iso": "BA",
                "name": "Bosnie-Herzégovine"
            },
            {
                "iso": "BW",
                "name": "Botswana"
            },
            {
                "iso": "BN",
                "name": "Brunéi Darussalam"
            },
            {
                "iso": "BR",
                "name": "Brésil"
            },
            {
                "iso": "BG",
                "name": "Bulgarie"
            },
            {
                "iso": "BF",
                "name": "Burkina Faso"
            },
            {
                "iso": "BI",
                "name": "Burundi"
            },
            {
                "iso": "BY",
                "name": "Bélarus"
            },
            {
                "iso": "BJ",
                "name": "Bénin"
            },
            {
                "iso": "KH",
                "name": "Cambodge"
            },
            {
                "iso": "CM",
                "name": "Cameroun"
            },
            {
                "iso": "CA",
                "name": "Canada"
            },
            {
                "iso": "CV",
                "name": "Cap-Vert"
            },
            {
                "iso": "CL",
                "name": "Chili"
            },
            {
                "iso": "CN",
                "name": "Chine"
            },
            {
                "iso": "CY",
                "name": "Chypre"
            },
            {
                "iso": "CO",
                "name": "Colombie"
            },
            {
                "iso": "KM",
                "name": "Comores"
            },
            {
                "iso": "CG",
                "name": "Congo"
            },
            {
                "iso": "KP",
                "name": "Corée du Nord"
            },
            {
                "iso": "KR",
                "name": "Corée du Sud"
            },
            {
                "iso": "CR",
                "name": "Costa Rica"
            },
            {
                "iso": "HR",
                "name": "Croatie"
            },
            {
                "iso": "CU",
                "name": "Cuba"
            },
            {
                "iso": "CI",
                "name": "Côte d’Ivoire"
            },
            {
                "iso": "DK",
                "name": "Danemark"
            },
            {
                "iso": "DJ",
                "name": "Djibouti"
            },
            {
                "iso": "DM",
                "name": "Dominique"
            },
            {
                "iso": "SV",
                "name": "El Salvador"
            },
            {
                "iso": "ES",
                "name": "Espagne"
            },
            {
                "iso": "EE",
                "name": "Estonie"
            },
            {
                "iso": "FJ",
                "name": "Fidji"
            },
            {
                "iso": "FI",
                "name": "Finlande"
            },
            {
                "iso": "FR",
                "name": "France"
            },
            {
                "iso": "GA",
                "name": "Gabon"
            },
            {
                "iso": "GM",
                "name": "Gambie"
            },
            {
                "iso": "GH",
                "name": "Ghana"
            },
            {
                "iso": "GI",
                "name": "Gibraltar"
            },
            {
                "iso": "GD",
                "name": "Grenade"
            },
            {
                "iso": "GL",
                "name": "Groenland"
            },
            {
                "iso": "GR",
                "name": "Grèce"
            },
            {
                "iso": "GP",
                "name": "Guadeloupe"
            },
            {
                "iso": "GU",
                "name": "Guam"
            },
            {
                "iso": "GT",
                "name": "Guatemala"
            },
            {
                "iso": "GG",
                "name": "Guernesey"
            },
            {
                "iso": "GN",
                "name": "Guinée"
            },
            {
                "iso": "GQ",
                "name": "Guinée équatoriale"
            },
            {
                "iso": "GW",
                "name": "Guinée-Bissau"
            },
            {
                "iso": "GY",
                "name": "Guyana"
            },
            {
                "iso": "GF",
                "name": "Guyane française"
            },
            {
                "iso": "GE",
                "name": "Géorgie"
            },
            {
                "iso": "GS",
                "name": "Géorgie du Sud et les îles Sandwich du Sud"
            },
            {
                "iso": "HT",
                "name": "Haïti"
            },
            {
                "iso": "HN",
                "name": "Honduras"
            },
            {
                "iso": "HU",
                "name": "Hongrie"
            },
            {
                "iso": "IN",
                "name": "Inde"
            },
            {
                "iso": "ID",
                "name": "Indonésie"
            },
            {
                "iso": "IQ",
                "name": "Irak"
            },
            {
                "iso": "IR",
                "name": "Iran"
            },
            {
                "iso": "IE",
                "name": "Irlande"
            },
            {
                "iso": "IS",
                "name": "Islande"
            },
            {
                "iso": "IL",
                "name": "Israël"
            },
            {
                "iso": "IT",
                "name": "Italie"
            },
            {
                "iso": "JM",
                "name": "Jamaïque"
            },
            {
                "iso": "JP",
                "name": "Japon"
            },
            {
                "iso": "JE",
                "name": "Jersey"
            },
            {
                "iso": "JO",
                "name": "Jordanie"
            },
            {
                "iso": "KZ",
                "name": "Kazakhstan"
            },
            {
                "iso": "KE",
                "name": "Kenya"
            },
            {
                "iso": "KG",
                "name": "Kirghizistan"
            },
            {
                "iso": "KI",
                "name": "Kiribati"
            },
            {
                "iso": "KW",
                "name": "Koweït"
            },
            {
                "iso": "LA",
                "name": "Laos"
            },
            {
                "iso": "LS",
                "name": "Lesotho"
            },
            {
                "iso": "LV",
                "name": "Lettonie"
            },
            {
                "iso": "LB",
                "name": "Liban"
            },
            {
                "iso": "LY",
                "name": "Libye"
            },
            {
                "iso": "LR",
                "name": "Libéria"
            },
            {
                "iso": "LI",
                "name": "Liechtenstein"
            },
            {
                "iso": "LT",
                "name": "Lituanie"
            },
            {
                "iso": "LU",
                "name": "Luxembourg"
            },
            {
                "iso": "MK",
                "name": "Macédoine"
            },
            {
                "iso": "MG",
                "name": "Madagascar"
            },
            {
                "iso": "MY",
                "name": "Malaisie"
            },
            {
                "iso": "MW",
                "name": "Malawi"
            },
            {
                "iso": "MV",
                "name": "Maldives"
            },
            {
                "iso": "ML",
                "name": "Mali"
            },
            {
                "iso": "MT",
                "name": "Malte"
            },
            {
                "iso": "MA",
                "name": "Maroc"
            },
            {
                "iso": "MQ",
                "name": "Martinique"
            },
            {
                "iso": "MU",
                "name": "Maurice"
            },
            {
                "iso": "MR",
                "name": "Mauritanie"
            },
            {
                "iso": "YT",
                "name": "Mayotte"
            },
            {
                "iso": "MX",
                "name": "Mexique"
            },
            {
                "iso": "MD",
                "name": "Moldavie"
            },
            {
                "iso": "MC",
                "name": "Monaco"
            },
            {
                "iso": "MN",
                "name": "Mongolie"
            },
            {
                "iso": "MS",
                "name": "Montserrat"
            },
            {
                "iso": "ME",
                "name": "Monténégro"
            },
            {
                "iso": "MZ",
                "name": "Mozambique"
            },
            {
                "iso": "MM",
                "name": "Myanmar"
            },
            {
                "iso": "NA",
                "name": "Namibie"
            },
            {
                "iso": "NR",
                "name": "Nauru"
            },
            {
                "iso": "NI",
                "name": "Nicaragua"
            },
            {
                "iso": "NE",
                "name": "Niger"
            },
            {
                "iso": "NG",
                "name": "Nigéria"
            },
            {
                "iso": "NU",
                "name": "Niue"
            },
            {
                "iso": "NO",
                "name": "Norvège"
            },
            {
                "iso": "NC",
                "name": "Nouvelle-Calédonie"
            },
            {
                "iso": "NZ",
                "name": "Nouvelle-Zélande"
            },
            {
                "iso": "NP",
                "name": "Népal"
            },
            {
                "iso": "OM",
                "name": "Oman"
            },
            {
                "iso": "UG",
                "name": "Ouganda"
            },
            {
                "iso": "UZ",
                "name": "Ouzbékistan"
            },
            {
                "iso": "PK",
                "name": "Pakistan"
            },
            {
                "iso": "PW",
                "name": "Palaos"
            },
            {
                "iso": "PA",
                "name": "Panama"
            },
            {
                "iso": "PG",
                "name": "Papouasie-Nouvelle-Guinée"
            },
            {
                "iso": "PY",
                "name": "Paraguay"
            },
            {
                "iso": "NL",
                "name": "Pays-Bas"
            },
            {
                "iso": "PH",
                "name": "Philippines"
            },
            {
                "iso": "PN",
                "name": "Pitcairn"
            },
            {
                "iso": "PL",
                "name": "Pologne"
            },
            {
                "iso": "PF",
                "name": "Polynésie française"
            },
            {
                "iso": "PR",
                "name": "Porto Rico"
            },
            {
                "iso": "PT",
                "name": "Portugal"
            },
            {
                "iso": "PE",
                "name": "Pérou"
            },
            {
                "iso": "QA",
                "name": "Qatar"
            },
            {
                "iso": "HK",
                "name": "R.A.S. chinoise de Hong Kong"
            },
            {
                "iso": "MO",
                "name": "R.A.S. chinoise de Macao"
            },
            {
                "iso": "RO",
                "name": "Roumanie"
            },
            {
                "iso": "GB",
                "name": "Royaume-Uni"
            },
            {
                "iso": "RU",
                "name": "Russie"
            },
            {
                "iso": "RW",
                "name": "Rwanda"
            },
            {
                "iso": "CF",
                "name": "République centrafricaine"
            },
            {
                "iso": "DO",
                "name": "République dominicaine"
            },
            {
                "iso": "CD",
                "name": "République démocratique du Congo"
            },
            {
                "iso": "CZ",
                "name": "République tchèque"
            },
            {
                "iso": "RE",
                "name": "Réunion"
            },
            {
                "iso": "EH",
                "name": "Sahara occidental"
            },
            {
                "iso": "BL",
                "name": "Saint-Barthélémy"
            },
            {
                "iso": "KN",
                "name": "Saint-Kitts-et-Nevis"
            },
            {
                "iso": "SM",
                "name": "Saint-Marin"
            },
            {
                "iso": "MF",
                "name": "Saint-Martin"
            },
            {
                "iso": "PM",
                "name": "Saint-Pierre-et-Miquelon"
            },
            {
                "iso": "VC",
                "name": "Saint-Vincent-et-les Grenadines"
            },
            {
                "iso": "SH",
                "name": "Sainte-Hélène"
            },
            {
                "iso": "LC",
                "name": "Sainte-Lucie"
            },
            {
                "iso": "WS",
                "name": "Samoa"
            },
            {
                "iso": "AS",
                "name": "Samoa américaines"
            },
            {
                "iso": "ST",
                "name": "Sao Tomé-et-Principe"
            },
            {
                "iso": "RS",
                "name": "Serbie"
            },
            {
                "iso": "CS",
                "name": "Serbie-et-Monténégro"
            },
            {
                "iso": "SC",
                "name": "Seychelles"
            },
            {
                "iso": "SL",
                "name": "Sierra Leone"
            },
            {
                "iso": "SG",
                "name": "Singapour"
            },
            {
                "iso": "SK",
                "name": "Slovaquie"
            },
            {
                "iso": "SI",
                "name": "Slovénie"
            },
            {
                "iso": "SO",
                "name": "Somalie"
            },
            {
                "iso": "SD",
                "name": "Soudan"
            },
            {
                "iso": "LK",
                "name": "Sri Lanka"
            },
            {
                "iso": "CH",
                "name": "Suisse"
            },
            {
                "iso": "SR",
                "name": "Suriname"
            },
            {
                "iso": "SE",
                "name": "Suède"
            },
            {
                "iso": "SJ",
                "name": "Svalbard et Île Jan Mayen"
            },
            {
                "iso": "SZ",
                "name": "Swaziland"
            },
            {
                "iso": "SY",
                "name": "Syrie"
            },
            {
                "iso": "SN",
                "name": "Sénégal"
            },
            {
                "iso": "TJ",
                "name": "Tadjikistan"
            },
            {
                "iso": "TZ",
                "name": "Tanzanie"
            },
            {
                "iso": "TW",
                "name": "Taïwan"
            },
            {
                "iso": "TD",
                "name": "Tchad"
            },
            {
                "iso": "TF",
                "name": "Terres australes françaises"
            },
            {
                "iso": "IO",
                "name": "Territoire britannique de l'océan Indien"
            },
            {
                "iso": "PS",
                "name": "Territoire palestinien"
            },
            {
                "iso": "TH",
                "name": "Thaïlande"
            },
            {
                "iso": "TL",
                "name": "Timor oriental"
            },
            {
                "iso": "TG",
                "name": "Togo"
            },
            {
                "iso": "TK",
                "name": "Tokelau"
            },
            {
                "iso": "TO",
                "name": "Tonga"
            },
            {
                "iso": "TT",
                "name": "Trinité-et-Tobago"
            },
            {
                "iso": "TN",
                "name": "Tunisie"
            },
            {
                "iso": "TM",
                "name": "Turkménistan"
            },
            {
                "iso": "TR",
                "name": "Turquie"
            },
            {
                "iso": "TV",
                "name": "Tuvalu"
            },
            {
                "iso": "UA",
                "name": "Ukraine"
            },
            {
                "iso": "UY",
                "name": "Uruguay"
            },
            {
                "iso": "VU",
                "name": "Vanuatu"
            },
            {
                "iso": "VE",
                "name": "Venezuela"
            },
            {
                "iso": "VN",
                "name": "Viêt Nam"
            },
            {
                "iso": "WF",
                "name": "Wallis-et-Futuna"
            },
            {
                "iso": "YE",
                "name": "Yémen"
            },
            {
                "iso": "ZM",
                "name": "Zambie"
            },
            {
                "iso": "ZW",
                "name": "Zimbabwe"
            },
            {
                "iso": "ZZ",
                "name": "région indéterminée"
            },
            {
                "iso": "EG",
                "name": "Égypte"
            },
            {
                "iso": "AE",
                "name": "Émirats arabes unis"
            },
            {
                "iso": "EC",
                "name": "Équateur"
            },
            {
                "iso": "ER",
                "name": "Érythrée"
            },
            {
                "iso": "VA",
                "name": "État de la Cité du Vatican"
            },
            {
                "iso": "FM",
                "name": "États fédérés de Micronésie"
            },
            {
                "iso": "US",
                "name": "États-Unis"
            },
            {
                "iso": "ET",
                "name": "Éthiopie"
            },
            {
                "iso": "BV",
                "name": "Île Bouvet"
            },
            {
                "iso": "CX",
                "name": "Île Christmas"
            },
            {
                "iso": "NF",
                "name": "Île Norfolk"
            },
            {
                "iso": "IM",
                "name": "Île de Man"
            },
            {
                "iso": "KY",
                "name": "Îles Caïmans"
            },
            {
                "iso": "CC",
                "name": "Îles Cocos - Keeling"
            },
            {
                "iso": "CK",
                "name": "Îles Cook"
            },
            {
                "iso": "FO",
                "name": "Îles Féroé"
            },
            {
                "iso": "HM",
                "name": "Îles Heard et MacDonald"
            },
            {
                "iso": "FK",
                "name": "Îles Malouines"
            },
            {
                "iso": "MP",
                "name": "Îles Mariannes du Nord"
            },
            {
                "iso": "MH",
                "name": "Îles Marshall"
            },
            {
                "iso": "UM",
                "name": "Îles Mineures Éloignées des États-Unis"
            },
            {
                "iso": "SB",
                "name": "Îles Salomon"
            },
            {
                "iso": "TC",
                "name": "Îles Turks et Caïques"
            },
            {
                "iso": "VG",
                "name": "Îles Vierges britanniques"
            },
            {
                "iso": "VI",
                "name": "Îles Vierges des États-Unis"
            },
            {
                "iso": "AX",
                "name": "Îles Åland"
            }
        ];

        // Public API here
        return {
            findAll: function () {
                return countryList;
            },
            getNameFromIso: function (iso) {
                for (i = 0; i < countryList.length; i++) {
                    if (countryList[i]["iso"] === iso) {
                        return countryList[i];
                    }
                }
                return undefined;

            }
        };
    });
