function sfhcFieldIdHelper(env) {
  const fieldData = {
    dev: {
      orgid: {value: '00D0T0000000N6E'},
      country: {field: '00N0T000004VKto'},
      recordType: {value: '0120T000000ATuW'},
      subStatus: {field: '00N0T000004Izk3'},
      reason: {field: '00N0T00000CYe4Q'},
      digitalTrackingData: {field: '00NIl000000aWLh'},
      sourceSystem: {field: 'HealthCloudGA__SourceSystem__c'},
      debug: {field: true}
    },
    sit: {
      orgid: {value: '00D3N000000HazT'},
      country: {field: '00N6N000000WDp6'},
      recordType: {value: '0126N000000GsqU'},
      subStatus: {field: '00N6N000000WDpY'},
      reason: {field: '00N6N0000019El0'},
      digitalTrackingData: {field: '00N9M000005Yv7R'},
      sourceSystem: {field: 'HealthCloudGA__SourceSystem__c'},
      debug: {field: true}
    },
    uat: {
      orgid: {value: '00D9Q00000AJkSn'},
      country: {field: '00N6N000000WDp6'},
      recordType: {value: '0126N000000GsqU'},
      subStatus: {field: '00N6N000000WDpY'},
      reason: {field: '00N6N0000019El0'},
      digitalTrackingData: {field: '00NOj000006H0jY'},
      sourceSystem: {field: '00N5g000000Ti2I'},
      debug: {field: true}
    },
    prd: {
      orgid: {value: '00D5g000001FTeM'},
      country: {field: '00N6N000000WDp6'},
      recordType: {value: '0126N000000GsqU'},
      subStatus: {field: '00N6N000000WDpY'},
      reason: {field: '00N6N0000019El0'},
      digitalTrackingData: {field: '00NOj000006H0jY'},
      sourceSystem: {field: 'HealthCloudGA__SourceSystem__c'},
      debug: {field: false}
    }
  };
  return fieldData[env];
}

module.exports = {
  sfhcFieldIdHelper
};
