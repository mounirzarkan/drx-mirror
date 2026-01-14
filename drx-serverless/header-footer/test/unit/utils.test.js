'use strict';

const {expect} = require('chai');
const utils = require('../../src/util/utils.js');
describe('#getHtmlAttributes', () => {
  it('CASE: getHtmlAttributes takes html and returns obj with src and alt properties', () => {
    const html =
      '<image mediaid="" alt="Access myCochlear dashboard" height="280" width="280" hspace="" vspace="" stylelabs-content-id="106744" thumbnailsrc="https://cochlearmediaportal.stylelabs.cloud/api/gateway/106744/thumbnail" src="https://mss-p-007-delivery.sitecorecontenthub.cloud/api/public/content/35d659a0116b4674a420efb1965485a9?v=e6173fc1" stylelabs-content-type="Image" />';
    const result = utils.getHtmlAttributes(html, 'image', ['src', 'alt']);

    expect(result).to.have.ownProperty('src');
    expect(result).to.have.ownProperty('alt');
  });

  it('CASE: getHtmlAttributes takes html and returns obj with alt property value: "https://mss-p-007-delivery.sitecorecontenthub.cloud/api/public/content/35d659a0116b4674a420efb1965485a9?v=e6173fc1"', () => {
    const html =
      '<image mediaid="" alt="Access myCochlear dashboard" height="280" width="280" hspace="" vspace="" stylelabs-content-id="106744" thumbnailsrc="https://cochlearmediaportal.stylelabs.cloud/api/gateway/106744/thumbnail" src="https://mss-p-007-delivery.sitecorecontenthub.cloud/api/public/content/35d659a0116b4674a420efb1965485a9?v=e6173fc1" stylelabs-content-type="Image" />';
    const result = utils.getHtmlAttributes(html, 'image', ['src', 'alt']);

    expect(result)
      .to.have.ownProperty('src')
      .and.to.equal(
        'https://mss-p-007-delivery.sitecorecontenthub.cloud/api/public/content/35d659a0116b4674a420efb1965485a9?v=e6173fc1'
      );
  });

  it('CASE: getHtmlAttributes takes html and returns obj with alt property value: "Access myCochlear dashboard"', () => {
    const html =
      '<image mediaid="" alt="Access myCochlear dashboard" height="280" width="280" hspace="" vspace="" stylelabs-content-id="106744" thumbnailsrc="https://cochlearmediaportal.stylelabs.cloud/api/gateway/106744/thumbnail" src="https://mss-p-007-delivery.sitecorecontenthub.cloud/api/public/content/35d659a0116b4674a420efb1965485a9?v=e6173fc1" stylelabs-content-type="Image" />';
    const result = utils.getHtmlAttributes(html, 'image', ['src', 'alt']);
    expect(result)
      .to.have.ownProperty('alt')
      .and.to.equal('Access myCochlear dashboard');
  });
});
