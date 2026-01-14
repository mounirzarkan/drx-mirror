import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ReadModeComposite from '../../Shared/ReadModeComposite/ReadModeComposite';
import getMissingTag from '../utils/getMissingTag';
import { replaceValueProperty } from '../utils/convertValueProperties';

const ReadMode = props => {
  const { data, labels, config } = props;
  const {
    elements,
    fields,
    id: sectionId,
    clkErrorLabel,
    errorLabel,
    onErrorHandle,
    errorLinkTo,
    // country: userCountry,
    isRequired = false,
  } = config;

  const { phones } = data;

  const dataFields = {
    value: {
      isPreferred: {
        text:
          labels[
            fields.filter(x => x.name === 'isPreferred')[0]?.text
          ] || 'empty',
      },
      isSmsEnabled: {
        text:
          labels[
            fields.filter(x => x.name === 'isSmsEnabled')[0]?.text
          ] || 'empty',
      },
    },
  };

  const contactId = useRef(0);
  const getContactData = () => {
    const contactData = phones?.value?.map(phoneData => {
      return { phoneData, id: ++contactId.current };
    });
    return (
      (contactData?.length > 0 && contactData) ||
      (isRequired ? [{ phoneData: {}, id: ++contactId.current }] : [])
    );
  };
  const [contactsData, setContactsData] = useState(getContactData());

  useEffect(() => {
    setContactsData(getContactData());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phones]);

  const contacts = contactsData.map(({ phoneData, id }, index) => {
    const { type } = phoneData;

    let matchedElement = elements?.find(element => {
      return element?.id && type?.value && type?.value === element.id;
    });
    // if can't find matchedElement use default-fallback else first element
    matchedElement =
      matchedElement ||
      elements?.find(element => {
        return element?.id === 'default-fallback';
      }) ||
      (elements && elements[0]);
    if (matchedElement) {
      const formatData = {
        fields: dataFields,
        ...phoneData,
      };

      const errorHandle = name => onErrorHandle(`[${index}].${name}`);

      const element = {
        ...matchedElement,
        id: matchedElement?.type,
        value: matchedElement?.value,
        validators: matchedElement?.validators,
      };
      const transformedData = replaceValueProperty(formatData);

      const missingTags = getMissingTag(
        matchedElement?.value,
        transformedData,
        element,
        {},
      );

      const missingTag =
        (missingTags &&
          (missingTags.some(t => t === 'type')
            ? 'type'
            : missingTags.some(t => t === 'country')
            ? 'country'
            : missingTags.some(t => t === 'nationalNumber')
            ? 'nationalNumber'
            : undefined)) ||
        undefined;

      const isInlineError =
        contactsData[index]?.phoneData?.phoneNumber?.value &&
        contactsData[index]?.phoneData?.phoneNumber?.value !== '';

      return (
        <div
          className={`ccl__list-read-mode__element ccl__list-read-mode__element--${sectionId}`}
          key={id}
        >
          <ReadModeComposite
            clkErrorLabel={labels[clkErrorLabel]}
            data={formatData}
            errorLabel={labels[errorLabel]}
            id={matchedElement?.type}
            onErrorHandle={onErrorHandle ? errorHandle : null}
            errorLinkTo={errorLinkTo || null}
            title={labels[matchedElement?.label]}
            validators={matchedElement?.validators}
            value={matchedElement?.value}
            missingTag={missingTag}
            isInlineError={isInlineError}
          />
        </div>
      );
    }
    return <div />;
  });

  return <div>{contacts}</div>;
};

ReadMode.propTypes = {
  /**
    Data - holds information that is referenced by format.
  */
  data: PropTypes.object.isRequired,
  /**
    config - configuration information
  */
  config: PropTypes.object.isRequired,
  /**
    labels - contains label text
  */
  labels: PropTypes.object.isRequired,
};

ReadMode.defaultProps = {
  data: {},
  config: { elements: [] },
  labels: {},
};

export default ReadMode;
