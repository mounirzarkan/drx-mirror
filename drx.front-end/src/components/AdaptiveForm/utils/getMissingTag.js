import mustache from 'mustache';
import { onValidate } from './actions';

function getValidators(validators, apiField) {
  return validators?.filter(({ apifield }) => {
    if (apifield) {
      return apiField === apifield;
    }
    // does not have apifield assume this validator applies for all tags in element.
    return true;
  });
}

function validateData(data, element, value, labels, obj) {
  // gets validators that apply to this value.
  const validators = getValidators(element?.validators, value);

  if (validators?.length > 0) {
    // calls validation
    const errors = onValidate(
      data,
      [{ ...element, validators, apifield: value }],
      labels,
    );
    if (errors) {
      const errorNames = Object.getOwnPropertyNames(errors);
      if (errorNames.length === 0) {
        // no errors
        // return original obj value;
        return obj;
      }
      // found error return missingTags array
      return errorNames;
    }
  }
  return obj;
}

function sectionFalsy(value) {
  // mustache definition of section falsy.
  return !value || (Array.isArray(value) && value.length === 0);
}

function dotNotationValue(obj, str) {
  // string dot notation to object value.
  return str.split('.').reduce((acc, property) => acc[property], obj);
}
/**
 * https://github.com/janl/mustache.js/blob/e90b2a9aeb945d7cee2b1cd3578d2089c5d3125d/mustache.js
 * Breaks up the given `template` string into a tree of tokens. If the `tags`
 * argument is given here it must be an array with two string values: the
 * opening and closing tags used in the template (e.g. [ "<%", "%>" ]). Of
 * course, the default is to use mustaches (i.e. mustache.tags).
 *
 * A token is an array with at least 4 elements. The first element is the
 * mustache symbol that was used inside the tag, e.g. "#" or "&". If the tag
 * did not contain a symbol (i.e. {{myValue}}) this element is "name". For
 * all text that appears outside a symbol this element is "text".
 *
 * The second element of a token is its "value". For mustache tags this is
 * whatever else was inside the tag besides the opening symbol. For text tokens
 * this is the text itself.
 *
 * The third and fourth elements of the token are the start and end indices,
 * respectively, of the token in the original template.
 *
 * Tokens that are the root node of a subtree contain two more elements: 1) an
 * array of tokens in the subtree and 2) the index in the original template at
 * which the closing tag for that section begins.
 *
 * Tokens for partials also contain two more elements: 1) a string value of
 * indendation prior to that tag and 2) the index of that tag on that line -
 * eg a value of 2 indicates the partial is the third tag on this line.
 */

function validateTags(parsedTags, data, element, labels) {
  // returns undefined | missingTags
  return parsedTags.reduce(
    (
      obj,
      [
        type,
        value,
        startPos,
        endPos,
        subTokens,
        subTokenIndex,
        indentation,
        indentationIndex,
      ],
    ) => {
      if (!obj) {
        switch (type) {
          // FYI - when needed add another case to support other tags.
          case 'name': {
            if (data) {
              // returns missingTags flagged by element data validation
              return validateData(data, element, value, labels, obj);
            }
            // no data return missingTag
            return value;
          }
          case '#': {
            if (data && value) {
              const notationValue = dotNotationValue(data, value);
              if (!sectionFalsy(notationValue)) {
                // recursive call validatedTags using section subTokens
                return validateTags(subTokens, data, element, labels);
              }
            }
            break;
          }
          default: {
            return obj;
          }
        }
      }
      return obj;
    },
    undefined,
  );
}

export default function getMissingTag(format, data, element, labels) {
  const parseFormat = mustache.parse(format);
  // returns undefined or missingTags array (data property that didnt pass validation)
  return validateTags(parseFormat, data, element, labels);
}
