// function to return required and validation messages
export default function getMessage(fieldData, message) {
  let obj =
    fieldData.messageArray.validators.length &&
    fieldData.messageArray.validators.find(
      o => o.key.value === message,
    );

  return obj.message.value;
}
