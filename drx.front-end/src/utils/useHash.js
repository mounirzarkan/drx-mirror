import React from 'react';
import md5 from 'md5';

export default function useHash(value) {
  const [hash, setHash] = React.useState(md5(value));

  React.useEffect(() => {
    setHash(md5(value));
  }, [value]);
  return [hash];
}
