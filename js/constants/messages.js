mindFrameApp.constant('MESSAGES', {
  common:{
    headers:{
      confirm:'Please confirm',
      warningRemovingExternalAuth:'You are about to remove external authenication'
    }
  },
  account:{
    confirmEnable:'Enable account ?',
    confirmDisable:'Disable account ?',
    enabled:'Success: The account is enabled',
    disabled:'Success: The account is disabled',
    infoSavedSuccess: 'Success: The account information has been saved successfully',
    infoSavedError: 'Error: There was a problem saving the account information. Please try again later',
    configSavedSuccess: 'Success: The account configuration has been saved successfully',
    configSavedError: 'Error: There was a problem saving the account configuration. Please try again later',
    aboutToRemoveExternalAuth: 'Are you sure you want to remove external authentication? The users in your account with external authentication will be changed to LOCAL authentication and an email wll be sent with their new password.',
    webExTestConfigError: 'Error: WebEx configuration is invalid',
    webExTestConfigSuccess: 'Success: WebEx Configuration is valid'
  },
  plan:{
    savedSuccess:'Success: __PLAN_NAME__ has been saved successfully',
    savedError:'Error: Plan code is already in use',
    updatedSuccess:'Success: __PLAN_NAME__ has been updated successfully',
    updatedError: 'Error: There was a problem updating the plan.'
  }
});

mindFrameApp.constant('VALIDATION_MESSAGES', {
  contact:{
    missing:{
      firstName:'First Name is missing',
      lastName:'Last Name is missing',
      email:'Email is missing',
      phone:'At least one phone number is mandatory',
      userid:'User Login ID is missing',
      username:'Please add a Valid Email / The Selected Email is already in use',
      passwordmatch: 'Passwords do not match'
    },
    unique:{
      userid:'User Login ID already exists'
    },
    invalidNumber:{
      officePhone:'Please Add a Valid Phone Number',
      homePhone:'Please Add a Valid Phone Number',
      mobilePhone:'Please Add a Valid Phone Number'
    }
  },
  content:{
    missing:{
      name:'Content Name is missing',
      description:'Content Description is missing',
      category:'Content Category is missing'
    }
  },
  plans:{
    missing:{
      name:'Plan Name is missing',
      code:'Plan Code is missing',
      description:'Plan Description is missing',
      price:'Please select a valid Price(only numbers)',
      numberOfUsers:'Please add a Valid Number',
      planOptionMonth:'Select a plan type',
      planType:'Select a plan type'
    },
    unique:{
      name:'Plan Name already exists',
      code:'Plan Code already exists'
    }
  },
  accountNew:{
    missing:{
      firstName:'First Name is missing',
      lastName:'Last Name is missing',
      companyName:'Company Name is missing',
      accountName:'Account Name is missing',
      email:'Email Address is missing',
      password:'Password is missing',
      temppassword:'Temporary Password is missing',
      primaryPhoneNumber:'Please add a Valid Phone Number'
    }
  },
  accountBilling:{
    missing:{
      firstName:'First Name is missing',
      lastName:'Last Name is missing',
      primaryPhone:'Primary Phone is missing',
      emailAddress:'Please Enter a Valid Email Address',
      billingAddress:'Billing Address is missing',
      country:'Country is missing',
      city:'City is missing',
      zipCode:'Zip Code is missing',
      state:'State is missing',
      creditCardNumber:'Please Enter a Valid Credit Card Number',
      creditCardSecurityCode:'Credit Card Security Code is missing',
      expirationMonth:'Credit Card Expiration Month is missing',
      expirationYear:'Credit Card Expiration Year is missing',
      productType:'Product Type is missing',
      license:'License is missing'
    }
  },
  groups:{
    unique:{
      group:'Group already exists'
    }
  }
});

mindFrameApp.constant('UI_CONSTANTS', {
  selectOption: {
    id: 'Select',
    name: 'Select an option'
  }
});
