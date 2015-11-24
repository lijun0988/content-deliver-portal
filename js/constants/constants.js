'use strict';

mindFrameApp.constant('AUTH_ROLES', {
    ROLE_SUPERUSER:{id:'ROLE_SUPERUSER', name:'Akkadian Admin'},
    ROLE_ADMIN:{id:'ROLE_ADMIN', name:'Client Admin'},
    ROLE_CONTENT_MANAGER:{id:'ROLE_CONTENT_MANAGER', name:'Content Manager'},
    ROLE_USER:{id:'ROLE_USER', name:'User'}
});

mindFrameApp.constant('AUTH_SOURCES', {
    LOCAL:{id:"LOCAL", name:"Local"},
    LDAP:{id:"LDAP", name:"LDAP"},
    ACTIVE_DIRECTORY:{id:"ACTIVE_DIRECTORY", name:"Active Directory"}
});

mindFrameApp.constant('SSO_CONFIGS', {
    ORACLE_IDP:{id:"ORACLE_IDP", name:"Oracle Idp"},
    CISCO_MEETING_PLACE:{id:"CISCO_MEETING_PLACE", name:"Cisco Meeting Place"},
    ADFS_SP:{id:"ADFS_SP", name:"ADFS SP"},
    NON_SINGLE_SIGN_ON:{id:"NON_SINGLE_SIGN_ON",name:"Non-Single Sign-On"}
});

mindFrameApp.constant('PLAN_HOSTING_TYPES', {ON_CLOUD:"ON_CLOUD", ON_PREMISES:"ON_PREMISES"});

mindFrameApp.constant('GEO_US_STATES', ['Alabama', 'Alaska', 'Arizona', 'Arkansas',
    'California', 'Colorado', 'Connecticut', 'Delaware',
    'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois',
    'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana',
    'Maine', 'Maryland', 'Massachusetts', 'Michigan',
    'Minnesota', 'Mississippi', 'Missouri', 'Montana',
    'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey',
    'New Mexico', 'New York', 'North Dakota', 'North Carolina',
    'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania',
    'Rhode Island', 'South Carolina', 'South Dakota',
    'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia',
    'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
]);

mindFrameApp.constant('GEO_WORLD_COUNTRIES', ["Andorra", "United Arab Emirates", "Afghanistan", "Antigua and Barbuda",
    "Anguilla", "Albania", "Armenia", "Angola", "Antarctica", "Argentina", "American Samoa",
    "Austria", "Australia", "Aruba", "Azerbaijan", "Bosnia and Herzegovina", "Barbados",
    "Bangladesh", "Belgium", "Burkina Faso", "Bulgaria", "Bahrain", "Burundi", "Benin", "Saint Bartholemy",
    "Bermuda", "Brunei", "Bolivia", "Bonaire", "Brazil", "Bahamas", "Bhutan", "Bouvet Island", "Botswana",
    "Belarus", "Belize", "Canada", "Cocos [Keeling] Islands", "Congo", "Central African Republic",
    "Republic of the Congo", "Switzerland", "Ivory Coast", "Cook Islands", "Chile", "Cameroon", "China",
    "Colombia", "Costa Rica", "Cuba", "Cape Verde", "Curacao", "Christmas Island", "Cyprus", "Czechia",
    "Germany", "Djibouti", "Denmark", "Dominica", "Dominican Republic", "Algeria", "Ecuador", "Estonia",
    "Egypt", "Western Sahara", "Eritrea", "Spain", "Ethiopia", "Finland", "Fiji", "Falkland Islands",
    "Micronesia", "Faroe Islands", "France", "Gabon", "United Kingdom", "Grenada", "Georgia",
    "French Guiana", "Guernsey", "Ghana", "Gibraltar", "Greenland", "Gambia", "Guinea", "Guadeloupe",
    "Equatorial Guinea", "Greece", "South Georgia and the South Sandwich Islands", "Guatemala", "Guam",
    "Guinea-Bissau", "Guyana", "Hong Kong", "Heard Island and McDonald Islands", "Honduras", "Croatia",
    "Haiti", "Hungary", "Indonesia", "Ireland", "Israel", "Isle of Man", "India",
    "British Indian Ocean Territory",
    "Iraq", "Iran", "Iceland", "Italy", "Jersey", "Jamaica", "Jordan", "Japan", "Kenya", "Kyrgyzstan",
    "Cambodia",
    "Kiribati", "Comoros", "Saint Kitts and Nevis", "North Korea", "South Korea", "Kuwait",
    "Cayman Islands",
    "Kazakhstan", "Laos", "Lebanon", "Saint Lucia", "Liechtenstein", "Sri Lanka", "Liberia", "Lesotho",
    "Lithuania", "Luxembourg", "Latvia", "Libya", "Morocco", "Monaco", "Moldova", "Montenegro",
    "Saint Martin",
    "Madagascar", "Marshall Islands", "Macedonia", "Mali", "Myanmar [Burma]", "Mongolia", "Macao",
    "Northern Mariana Islands", "Martinique", "Mauritania", "Montserrat", "Malta", "Mauritius", "Maldives",
    "Malawi", "Mexico", "Malaysia", "Mozambique", "Namibia", "New Caledonia", "Niger", "Norfolk Island",
    "Nigeria",
    "Nicaragua", "Netherlands", "Norway", "Nepal", "Nauru", "Niue", "New Zealand", "Oman", "Panama", "Peru",
    "French Polynesia", "Papua New Guinea", "Philippines", "Pakistan", "Poland",
    "Saint Pierre and Miquelon",
    "Pitcairn Islands", "Puerto Rico", "Palestine", "Portugal", "Palau", "Paraguay", "Qatar",
    "Romania", "Serbia", "Russia", "Rwanda", "Saudi Arabia", "Solomon Islands", "Seychelles", "Sudan",
    "Sweden",
    "Singapore", "Saint Helena", "Slovenia", "Svalbard and Jan Mayen", "Slovakia", "Sierra Leone",
    "San Marino",
    "Senegal", "Somalia", "Suriname", "South Sudan", "El Salvador", "Sint Maarten",
    "Syria", "Swaziland", "Turks and Caicos Islands", "Chad", "French Southern Territories", "Togo",
    "Thailand",
    "Tajikistan", "Tokelau", "East Timor", "Turkmenistan", "Tunisia", "Tonga", "Turkey",
    "Trinidad and Tobago",
    "Tuvalu", "Taiwan", "Tanzania", "Ukraine", "Uganda", "U.S. Minor Outlying Islands", "United States",
    "Uruguay",
    "Uzbekistan", "Vatican City", "Saint Vincent and the Grenadines", "Venezuela", "British Virgin Islands",
    "U.S. Virgin Islands", "Vietnam", "Vanuatu", "Wallis and Futuna", "Samoa", "Kosovo", "Yemen", "Mayotte",
    "South Africa", "Zambia", "Zimbabwe"
]);