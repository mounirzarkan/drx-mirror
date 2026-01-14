import React from 'react';
import { useLocation } from 'react-router-dom';
import {
  ErrorMessage,
  Preloader,
  UserTabs,
} from '@cochlear-design-system/foundation';
import ConfirmationBlock from './ConfirmationBlock';
import ContentElementBlock from './ContentElementBlock';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function SecurityAndPrivacyView({
  config,
  data,
  handleCallback,
  handleClose,
  showConfirmation,
}) {
  const query = useQuery();
  const { sections, email } = data;

  // get query params
  const user = encodeURIComponent(query.get('user'));
  const error = query.get('error');

  // callback function passed as prop
  const { handleQueryParams, routerLink, routerLocation } = config;

  // pass query params back to callback function
  React.useEffect(() => {
    const ids = {
      user,
      error,
    };
    handleQueryParams(ids);
  }, [handleQueryParams, user, error]);

  // show the email / password change confirmation 'pop-up'
  if (showConfirmation) {
    return (
      <ConfirmationBlock
        email={email?.toLowerCase()}
        section={sections[0]}
        handleClose={handleClose}
        updateType={config.updateType}
      />
    );
  }

  let displayContent;

  if (config.isLoading) {
    displayContent = (
      <Preloader
        style={{ padding: '1.5rem .5rem' }}
        lines={['title', 'label-field', 'label-field']}
      />
    );
  } else if (config.isError) {
    displayContent = (
      <ErrorMessage
        codeLabel={config.errorView.codeLabel}
        errorResponse={config.errorView.errorResponse}
        data={config.errorView.data}
        style={{ paddingTop: '1rem' }}
        mode={config.mode}
        handleCallback={config.errorView.handleCallback}
      />
    );
  } else if (config.mode === 'default') {
    displayContent =
      sections?.length > 0
        ? sections.map(section => {
            // Ability to hide section
            const hideSection = section.hide;
            if (hideSection) return null;
            // if not hidden, create content block
            return (
              <section
                key={section.id}
                data-name={section.name}
                className="ccl__l__section"
              >
                <ContentElementBlock
                  section={section}
                  email={email.toLowerCase()}
                  handleCallback={handleCallback}
                />
              </section>
            );
          })
        : null;
  }

  return (
    <UserTabs
      data={{
        content: {
          text: displayContent,
        },
        tabsData: config.tabs,
      }}
      config={{
        isLoading: config.isLoading,
        callbackParent: () => {},
        Link: routerLink,
        routerLocation,
      }}
    />
  );
}

export default SecurityAndPrivacyView;
