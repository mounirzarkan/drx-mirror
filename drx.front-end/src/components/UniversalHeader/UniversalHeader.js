import React from 'react';
import { UniversalHeader as UHComp } from '@cochlear-design-system/features.universalHeader';
import { useUniversalHeader } from './useUniversalHeader'; // Import the hook

const getPersonas = personas => {
  if (personas.includes('carer') && personas.includes('recipient'))
    return 'carer-recipient';
  if (personas.includes('carer')) return 'carer';
  if (personas.includes('recipient')) return 'recipient';
  return '';
};

function UniversalHeader({
  token,
  tokenDetails,
  attributeDetails,
  routeParams,
  accessToken,
}) {
  // Use the hook to get the config

  const uhResp = useUniversalHeader({
    token,
    tokenDetails,
    routeParams,
    attributeDetails,
    accessToken,
  });

  const personas =
    attributeDetails && attributeDetails.personas
      ? attributeDetails.personas.map(i => i.toLowerCase())
      : [];
  return (
    <>
      {uhResp.isLoading && <></>}
      {!uhResp.isLoading && uhResp.data && (
        <UHComp
          config={uhResp?.data}
          data={{
            fullName: tokenDetails.name,
            lastName: tokenDetails.lastName,
            firstName: tokenDetails.firstName,
            countryCode: tokenDetails.countryCode,
            personaType: getPersonas(personas),
          }}
        />
      )}
    </>
  );
}

export default UniversalHeader;
