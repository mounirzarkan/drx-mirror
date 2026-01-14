import React from 'react';
import {
  Title,
  Text,
  Button,
  Modal,
} from '@cochlear-design-system/foundation';

function confirmationBlock({
  email,
  updateType,
  section,
  handleClose,
}) {
  return (
    <Modal
      show={true}
      onHide={handleClose}
      size="xl"
      dialogClassName="-leftAlign"
    >
      <Modal.Header closeButton>
        <Title
          content={section.title}
          tag="h1"
          data-nw-page-title
          style={{
            marginTop: '.5em',
          }}
        />
      </Modal.Header>
      <Modal.Body>
        {/* // show the text for change login email or change password  */}
        {updateType === 'ChangePassword' ? (
          <Text
            content={section.bodyPassword.replace(
              /\{email\}/g,
              email,
            )}
            isHTML
            tag="p"
            data-nw-page-description
          />
        ) : (
          <Text
            content={section.bodyLoginEmail.replace(
              /\{email\}/g,
              email,
            )}
            isHTML
            tag="p"
            data-nw-page-description
          />
        )}
        <Text
          content={section.body}
          isHTML
          tag="p"
          data-nw-page-description
          style={{ marginTop: '1em' }}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button
          onClick={() => handleClose()}
          size="large"
          text={section.button.text}
        />
      </Modal.Footer>
    </Modal>
  );
}

export default confirmationBlock;
