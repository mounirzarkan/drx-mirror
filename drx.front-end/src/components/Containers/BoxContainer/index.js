import React from 'react';
import { Placeholder } from '@sitecore-jss/sitecore-jss-react';

const BoxContainer = ({
  rendering,
  params,
  token,
  tokenDetails,
  url,
  routeParams,
  labels,
  headerFooterDetails,
}) => (
  <div className={`content__box ${params.style || ''}`}>
    <Placeholder
      name="drx-content-box"
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

export default BoxContainer;
