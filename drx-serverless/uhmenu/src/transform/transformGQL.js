const {DataTransform: convertor} = require('node-json-transform');
const utils = require('../util/utils');
const log = require('../util/logUtil.js');

function transformConfigurationResponse(resp) {
  const whatsnewContentNestedMap = {
    list: 'list',
    item: {
      image: {
        href: 'jmage.src',
        'alt-text': 'jmage.alt',
        value: 'jmage.value'
      },
      title: 'title.value',
      text: 'text.value',
      button: {
        text: 'buttonText.value',
        action: 'buttonAction.value',
        style: 'buttonStyle.value'
      }
    },
    operate: [
      {
        run: function (image) {
          if (!image.href && image.value) {
            try {
              // Only process if image.value exists
              if (image.value) {
                const imageProps = utils.getHtmlAttributes(
                  image.value,
                  'image',
                  ['src', 'alt']
                );
                image.href = imageProps.src;
                image['alt-text'] = imageProps.alt;
              }
            } catch (error) {
              log.debug(
                'transformGQL - transformConfigurationResponse - error while extracting image attributes'
              );
              log.debug(error);
            }

            delete image.value;
          }
          return image;
        },
        on: 'image'
      }
    ]
  };

  const dropDownNestedMap = {
    list: 'list',
    item: {
      icon: 'icon.value',
      target: 'link.target',
      label: 'link.text',
      url: 'link.url'
    }
  };
  const map = {
    item: {
      uhmenuTitle: 'uhmenuTitle.value',
      recipientCarerText: 'recipientCarerText.value',
      recipientText: 'recipientText.value',
      carerText: 'carerText.value',
      logoutLabel: 'logoutLabel.value',
      dropDownList: 'dropDownList.links',
      dropDownListForPending: 'dropDownListForPending.links',
      contentForPending: 'contentForPending.slides',
      whatsnew: {
        toggle: 'whatsNewToggle.value',
        popup: {
          label: 'whatsNewPopupLabel.value',
          close: 'whatsNewPopupClose.value'
        },
        version: 'whatsNewVersion.value',
        closeBtn: 'whatsNewCloseButton.value',
        content: 'whatsNewContent.slides'
      }
    },
    operate: [
      {
        run: function (value) {
          return convertor({list: value}, whatsnewContentNestedMap).transform();
        },
        on: 'whatsnew.content'
      },
      {
        run: function (value) {
          return value === true ? 'on' : 'off';
        },
        on: 'whatsnew.toggle'
      },
      {
        run: function (value) {
          return convertor({list: value}, dropDownNestedMap).transform();
        },
        on: 'dropDownList'
      },
      {
        run: function (value) {
          return convertor({list: value}, dropDownNestedMap).transform();
        },
        on: 'dropDownListForPending'
      },
      {
        run: function (value) {
          return convertor({list: value}, whatsnewContentNestedMap).transform();
        },
        on: 'contentForPending'
      }
    ]
  };

  const result = convertor(resp.item, map).transform();
  return result;
}

module.exports = {transformConfigurationResponse};
