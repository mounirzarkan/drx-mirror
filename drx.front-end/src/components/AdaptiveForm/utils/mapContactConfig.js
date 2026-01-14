export default function mapContactConfig(labels) {
  return {
    read: {
      onErrorHandle: missingTag => {
        alert('missing: ' + missingTag);
      },

      errorLinkTo: null,
      clkErrorLabel: 'aboutMe.adaptiveForm.read.clkError.label',
      errorLabel: 'aboutMe.adaptiveForm.read.error.label',

      fields: {
        value: {
          isPreferred: {
            text: 'aboutMe.listView.contact.field.isPreferred',
          },
          isSmsEnabled: {
            text: 'aboutMe.listView.contact.field.isSmsEnabled',
          },
        },
      },

      elements: [
        {
          type: 'Mobile',
          label: 'aboutMe.listView.title.mobile.label',
          value:
            '<div class="ccl__list-read-mode__element"><div class="ccl__list-read-mode__element__value">{{phoneNumber}}</div>{{#ocSms}}<div class="ccl__list-read-mode__element__field"><span class="ccl__icon ccl__icon--check-circle ccl__icon--color--success"></span>{{fields.isSmsEnabled.text}}</div>{{/ocSms}}{{#isPrimary}}<div class="ccl__list-read-mode__element__field">{{fields.isPreferred.text}}</div>{{/isPrimary}}</div>',
          validators: [
            {
              apifield: 'phoneNumber',
              type: 'predefined',
              key: 'required',
              message:
                'aboutMe.adaptiveForm.phoneNumber.validation.required',
            },
          ],
        },
        {
          type: 'Fax',
          label: 'aboutMe.listView.title.fax.label',
          value:
            '<div class="ccl__list-read-mode__element"><div class="ccl__list-read-mode__element__value">{{phoneNumber}}</div>{{#ocSms}}<div class="ccl__icon ccl__icon--check-circle ccl__icon--color--success"></span>{{fields.isSmsEnabled.text}}</div>{{/ocSms}}{{#isPrimary}}<div class="ccl__list-read-mode__element__field">{{fields.isPreferred.text}}</div>{{/isPrimary}}</div>',
        },
        {
          type: 'Home',
          label: 'aboutMe.listView.title.home.label',
          value:
            '<div class="ccl__list-read-mode__element"><div class="ccl__list-read-mode__element__value">{{phoneNumber}}</div>{{#ocSms}}<div class="ccl__list-read-mode__element__field"><span class="ccl__icon ccl__icon--check-circle ccl__icon--color--success"></span>{{fields.isSmsEnabled.text}}</div>{{/ocSms}}{{#isPrimary}}<div class="ccl__list-read-mode__element__field">{{fields.isPreferred.text}}</div>{{/isPrimary}}</div>',
        },
        {
          type: 'Work',
          label: 'aboutMe.listView.title.work.label',
          value:
            '<div class="ccl__list-read-mode__element"><div class="ccl__list-read-mode__element__value">{{phoneNumber}}</div>{{#ocSms}}<div class="ccl__list-read-mode__element__field"><span class="ccl__icon ccl__icon--check-circle ccl__icon--color--success"></span>{{fields.isSmsEnabled.text}}</div>{{/ocSms}}{{#isPrimary}}<div class="ccl__list-read-mode__element__field">{{fields.isPreferred.text}}</div>{{/isPrimary}}</div>',
        },
      ],
    },
  };
}
