import { JobLocationRestriction } from "@prisma/client"

const ASIA = [
  { code: "AE", name: "United Arab Emirates" },
  { code: "AF", name: "Afghanistan" },
  { code: "AM", name: "Armenia" },
  { code: "AZ", name: "Azerbaijan" },
  { code: "BD", name: "Bangladesh" },
  { code: "BH", name: "Bahrain" },
  { code: "BN", name: "Brunei" },
  { code: "BT", name: "Bhutan" },
  { code: "CC", name: "Cocos (Keeling) Islands" },
  { code: "CN", name: "China" },
  { code: "CX", name: "Christmas Island" },
  { code: "GE", name: "Georgia" },
  { code: "HK", name: "Hong Kong" },
  { code: "ID", name: "Indonesia" },
  { code: "IL", name: "Israel" },
  { code: "IN", name: "India" },
  { code: "IO", name: "British Indian Ocean Territory" },
  { code: "IQ", name: "Iraq" },
  { code: "IR", name: "Iran" },
  { code: "JO", name: "Jordan" },
  { code: "JP", name: "Japan" },
  { code: "KG", name: "Kyrgyzstan" },
  { code: "KH", name: "Cambodia" },
  { code: "KP", name: "North Korea" },
  { code: "KR", name: "South Korea" },
  { code: "KW", name: "Kuwait" },
  { code: "KZ", name: "Kazakhstan" },
  { code: "LA", name: "Laos" },
  { code: "LB", name: "Lebanon" },
  { code: "LK", name: "Sri Lanka" },
  { code: "MM", name: "Myanmar (Burma)" },
  { code: "MN", name: "Mongolia" },
  { code: "MO", name: "Macao" },
  { code: "MV", name: "Maldives" },
  { code: "MY", name: "Malaysia" },
  { code: "NP", name: "Nepal" },
  { code: "OM", name: "Oman" },
  { code: "PH", name: "Philippines" },
  { code: "PK", name: "Pakistan" },
  { code: "PS", name: "Palestine" },
  { code: "QA", name: "Qatar" },
  { code: "SA", name: "Saudi Arabia" },
  { code: "SG", name: "Singapore" },
  { code: "SY", name: "Syria" },
  { code: "TH", name: "Thailand" },
  { code: "TJ", name: "Tajikistan" },
  { code: "TM", name: "Turkmenistan" },
  { code: "TR", name: "Turkey" },
  { code: "TW", name: "Taiwan" },
  { code: "UZ", name: "Uzbekistan" },
  { code: "VN", name: "Vietnam" },
  { code: "YE", name: "Yemen" },
]

const EUROPE = [
  { code: "AD", name: "Andorra" },
  { code: "AL", name: "Albania" },
  { code: "AT", name: "Austria" },
  { code: "AX", name: "Aland" },
  { code: "BA", name: "Bosnia and Herzegovina" },
  { code: "BE", name: "Belgium" },
  { code: "BG", name: "Bulgaria" },
  { code: "BY", name: "Belarus" },
  { code: "CH", name: "Switzerland" },
  { code: "CY", name: "Cyprus" },
  { code: "CZ", name: "Czech Republic" },
  { code: "DE", name: "Germany" },
  { code: "DK", name: "Denmark" },
  { code: "EE", name: "Estonia" },
  { code: "ES", name: "Spain" },
  { code: "FI", name: "Finland" },
  { code: "FO", name: "Faroe Islands" },
  { code: "FR", name: "France" },
  { code: "GB", name: "United Kingdom" },
  { code: "GG", name: "Guernsey" },
  { code: "GI", name: "Gibraltar" },
  { code: "GR", name: "Greece" },
  { code: "HR", name: "Croatia" },
  { code: "HU", name: "Hungary" },
  { code: "IE", name: "Ireland" },
  { code: "IM", name: "Isle of Man" },
  { code: "IS", name: "Iceland" },
  { code: "IT", name: "Italy" },
  { code: "JE", name: "Jersey" },
  { code: "LI", name: "Liechtenstein" },
  { code: "LT", name: "Lithuania" },
  { code: "LU", name: "Luxembourg" },
  { code: "LV", name: "Latvia" },
  { code: "MC", name: "Monaco" },
  { code: "MD", name: "Moldova" },
  { code: "ME", name: "Montenegro" },
  { code: "MK", name: "North Macedonia" },
  { code: "MT", name: "Malta" },
  { code: "NL", name: "Netherlands" },
  { code: "NO", name: "Norway" },
  { code: "PL", name: "Poland" },
  { code: "PT", name: "Portugal" },
  { code: "RO", name: "Romania" },
  { code: "RS", name: "Serbia" },
  { code: "RU", name: "Russia" },
  { code: "SE", name: "Sweden" },
  { code: "SI", name: "Slovenia" },
  { code: "SJ", name: "Svalbard and Jan Mayen" },
  { code: "SK", name: "Slovakia" },
  { code: "SM", name: "San Marino" },
  { code: "UA", name: "Ukraine" },
  { code: "VA", name: "Vatican City" },
  { code: "XK", name: "Kosovo" },
]

export const getLocationRequirements = (
  locationrestriction: JobLocationRestriction
) => {
  switch (locationrestriction) {
    case "ASIA":
      return ASIA.map((country) => ({
        "@type": "Country",
        name: country.code,
      }))

    case "EUROPE":
      return EUROPE.map((country) => ({
        "@type": "Country",
        name: country.code,
      }))

    case "US":
      return {
        "@type": "Country",
        name: "US",
      }

    default:
      return [
        ...ASIA.map((country) => ({
          "@type": "Country",
          name: country.code,
        })),
        ...EUROPE.map((country) => ({
          "@type": "Country",
          name: country.code,
        })),
        {
          "@type": "Country",
          name: "US",
        },
      ]
  }
}
