import React from 'react';
import { Placeholder } from '@sitecore-jss/sitecore-jss-react';

const CenteredContainer = ({
  rendering,
  token,
  tokenDetails,
  attributeDetails,
  url,
  routeParams,
  labels,
  headerFooterDetails,
}) => (
  <div className="content__centered--default">
    <Placeholder
      name="drx-content-centered-default"
      rendering={rendering}
      token={token}
      tokenDetails={tokenDetails}
      attributeDetails={attributeDetails}
      routeParams={routeParams}
      labels={labels}
      url={url}
      headerFooterDetails={headerFooterDetails}
    />
  </div>
);

export default CenteredContainer;
