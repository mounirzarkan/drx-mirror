/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../../config';
import getCountryAPI from '../../utils/getCountryAPI';

const { cochlearDotCom, apiEndpoint } = config;
const getApi = `${apiEndpoint}/contents/header-footer`;

function menuLink(item) {
  if (item) {
    const { href, text, target } = item;

    // some links are relative in the api
    const path =
      href.substring(0, 4) !== 'http'
        ? `${cochlearDotCom}${href}`
        : href;

    return (
      <li key={path}>
        <a
          data-ecategory="Footer Links"
          href={path}
          target={target}
          rel="noopener noreferrer"
        >
          {text}
        </a>
      </li>
    );
  }
  return null;
}

function socialLink(items) {
  return (
    items &&
    items.map(item => (
      <li key={item.link.text}>
        <a
          href={item.link.href}
          title={item.link.text}
          target={item.link.target}
          rel="noopener noreferrer"
          aria-label={item.link.text}
        >
          <span
            className="social-media__icon"
            style={{
              backgroundImage: `url(${item.icon.src})`,
            }}
          >
            <span className="is-sr-only">{item.link.text}</span>
          </span>
        </a>
      </li>
    ))
  );
}

function Footer(props) {
  const { routeParams, tokenDetails } = props;
  const [footerLinks, setFooterLinks] = useState({});
  const [footerSocialLinks, setFooterSocialLinks] = useState([]);
  const [copyright, setCopyright] = useState('');

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    const fetchData = async () => {
      try {
        // check if the data is already in sessionStorage
        const storedData = sessionStorage.getItem('headerFooterData');
        const parsedData = storedData && JSON.parse(storedData);
        // check if url params for country and language match with what is stored
        // we dont want to reuse the header footer after a user logs out and then a user from
        // a different country/language logs in
        const country = getCountryAPI(tokenDetails.countryCode);
        if (
          parsedData &&
          parsedData.countryCode === country &&
          parsedData.langCode === routeParams.lang
        ) {
          setFooterLinks(parsedData.footerLinks);
          setFooterSocialLinks(parsedData.footerSocialLinks);
          setCopyright(parsedData.footerCopyright);
        } else {
          const response = await axios.get(
            `${getApi}?lng=${routeParams.lang}&country=${country}`,
            { signal },
          );
          setFooterLinks(response.data.footerLinks);
          setFooterSocialLinks(response.data.footerSocialLinks);
          setCopyright(response.data.footerCopyright);

          // Store data in sessionStorage
          sessionStorage.setItem(
            'headerFooterData',
            JSON.stringify(response.data),
          );
        }
      } catch (error) {
        if (error.name === 'AbortError') {
          // The request was cancelled.
          console.log('Request was cancelled');
        } else {
          console.error('Error fetching data: ', error);
        }
      }
    };

    fetchData();

    // Cleanup: Abort the request if the component unmounts
    return () => {
      abortController.abort();
    };
  }, []); // the empty dependancy array ensures that the effect runs once on component mount

  return (
    <footer className="footer">
      <section className="footer__cochlear">
        <div className="container">
          <div className="columns is-centered">
            <div className="column is-9-tablet is-11-desktop">
              <div className="columns is-desktop">
                <div className="column is-narrow is-paddingless">
                  <figure className="image cochlear-logo">
                    <img
                      src="https://assets.cochlear.com/api/public/content/a8c5c4166cba4bdd85fd69811a617275?v=8b63b658"
                      alt="Cochlear"
                    />
                  </figure>
                </div>

                <div className="column">
                  <ul className="footer__cochlear__links">
                    <li className="col-a">
                      <ul>
                        <li className="col-a-a">
                          <ul>
                            {footerLinks.column1 &&
                              footerLinks.column1.map(footerLink =>
                                menuLink(footerLink),
                              )}
                          </ul>
                        </li>
                        <li className="col-a-b">
                          <ul>
                            {footerLinks.column2 &&
                              footerLinks.column2.map(footerLink =>
                                menuLink(footerLink),
                              )}
                          </ul>
                        </li>
                      </ul>
                    </li>
                    <li className="col-b">
                      <ul>
                        {footerLinks.column3 &&
                          footerLinks.column3.map(footerLink =>
                            menuLink(footerLink),
                          )}
                      </ul>
                    </li>
                  </ul>
                </div>
                <div className="column is-narrow">
                  <ul className="social-media">
                    {socialLink(footerSocialLinks)}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="footer__copyright">
        <div className="container">
          <div className="columns is-centered">
            <div className="column is-11-desktop">
              <div className="has-text-centered has-text-right-tablet">
                <p>{copyright}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </footer>
  );
}

export default Footer;
