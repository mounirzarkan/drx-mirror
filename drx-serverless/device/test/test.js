const axios = require('axios');
const formData = {
  orgid: '00D9E000000Cz8Z',
  // orgid: '00D1j0000008arI',   sit org
  retURL: 'http://',
  email: 'kevlee@cochlear.com',
  subject: 'test drx subject service node',
  description: 'test drx description Friday',
  '00N2400000JKElL': '237204272473158',
  '00N2400000IGOy8': '01/01/1984',
  '00N2400000E9a8Q': '123123123',
  '00N2400000IGOyY': 'Email',
  recordType: '01224000000kDqA',
  '00N2400000IGOxh': 'Online Service Request',
  reason: 'Service Request'
};

const encodeForm = (data) => {
  return Object.keys(data)
    .map((key) => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
    .join('&');
};

axios
  .post(
    'https://cochlear--UOB.cs88.my.salesforce.com/servlet/servlet.WebToCase?encoding=UTF-8',
    encodeForm(formData),
    {headers: {'content-type': 'application/x-www-form-urlencoded'}}
  )
  .then(function (response) {
    console.log('success response: ', response);
  })
  .catch(function (error) {
    console.log('error: ', error);
  });
