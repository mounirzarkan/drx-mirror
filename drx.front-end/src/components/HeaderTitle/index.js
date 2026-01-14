import React from 'react';

// import { Text, RichText } from '@sitecore-jss/sitecore-jss-react';
import { Title, Text } from '@cochlear-design-system/foundation';

const HeaderTitle = props => {
  const { fields } = props;
  const { heading, description } = fields;

  return (
    <header className="header__title">
      <Title content={heading.value} tag="h1" data-nw-page-title />
      <Text content={description.value} data-nw-page-description />
    </header>
  );
};

export default HeaderTitle;
