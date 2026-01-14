import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';
import { Icon } from '@cochlear-design-system/foundation';

function Content(props) {
  const { data } = props;

  return (
    <div className="ccl-l-tabs__content__inner">{data.text}</div>
  );
}

/**
 * Primary UI component for Tabs
 */

function Tabs(props) {
  const location = useLocation();
  const { data, config } = props;

  const { tabsData, content } = data;
  const { accountId, userId, tabs, labels } = tabsData;

  // which tab is active
  const [activeTab, setActiveTab] = useState(0);

  const [activeUser, setActiveUser] = useState(tabs[0]);
  // show/hide the carer list
  const [activeDropdown, setActiveDropdown] = useState(false);

  // set the active tab and content area to the click user based on id
  // update whether the dropdown is open/closed
  const handleActiveTab = tabData => {   

    const { tabIndex } = tabData;
    config.callbackParent(tabIndex);
    setActiveTab(tabIndex);
    setActiveUser(tabData);
    setActiveDropdown(false);
  };

  const handleDropdown = () => {
    if (activeTab === 0) setActiveTab(-1);
    setActiveDropdown(!activeDropdown);
  };

  // update active tab and user based on query param if it exists
  useEffect(() => {
    // check if we have more than one tab
    if (tabs.length > 1 && userId) {
      const userTab = tabs[userId];
      if (userTab) {
        return handleActiveTab(userTab);
      }
    }
    return undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const tabsLayout = (t, l) => {
    const numberOfTabs = t.length;
    const dropdownLength = numberOfTabs - 1;
    const disableLink = config?.isLoading;
    /*
     * dont show tabs at all when there is only one user
     *
     */
    if (numberOfTabs === 1) {
      return null;
    }
    /*
     * show tabs side by side when there is a couple of users
     *
     */
    if (numberOfTabs === 2) {
      return (
        <div className="ccl-l-tabs__tabs-row">
          {t.map((tab, index) => (
            <div
              className={`ccl-l-tabs__tab ${
                // is this tab active?
                activeTab === tab.tabIndex
                  ? 'ccl-l-tabs__tab--is-active'
                  : ''
              }`}
              key={tab.tabIndex}
              data-nw-tab={index + 1}
              data-nw-tab-name={`${tab.firstName} ${tab.lastName}`}
              data-nw-tab-usertype={tab.type}
            >
              <Link
                onClick={e =>
                  disableLink
                    ? e.preventDefault()
                    : handleActiveTab(tab)
                }
                to={
                  disableLink
                    ? '#'
                    : `${location.pathname}?account=${accountId}&user=${tab.tabIndex}`
                }
                className={`ccl-l-tabs__tab__button ${
                  disableLink
                    ? 'ccl-l-tabs__tab__button--disabled'
                    : ''
                }`}
              >
                {tab.firstName} {tab.lastName}
                <span className="ccl-l-tabs__tab__button__details is-hidden-mobile">
                  {tab.type}
                </span>
              </Link>
            </div>
          ))}
        </div>
      );
    }
    /*
     * more than 2 users, show primary tab and then a dropdown list in the other
     *
     */
    return (
      <div className="ccl-l-tabs__tabs-row">
        {/* return the first user */}
        <div
          className={`ccl-l-tabs__tab ${
            // is this tab active?
            activeTab === 0 ? 'ccl-l-tabs__tab--is-active' : ''
          }`}
          data-nw-tab="1"
          data-nw-tab-name={`${t[0].firstName} ${t[0].lastName}`}
          data-nw-tab-usertype={t[0].type}
        >
          <Link
            onClick={e =>
              disableLink ? e.preventDefault() : handleActiveTab(t[0])
            }
            to={
              disableLink
                ? '#'
                : `${location.pathname}?account=${accountId}&user=${t[0].tabIndex}`
            }
            className={`ccl-l-tabs__tab__button ${
              disableLink ? 'ccl-l-tabs__tab__button--disabled' : ''
            }`}
          >
            {t[0].firstName} {t[0].lastName}
            <span className="ccl-l-tabs__tab__button__details is-hidden-mobile">
              {t[0].type}
            </span>
          </Link>
        </div>
        {/* return the other users in a list */}
        <div
          className={`ccl-l-tabs__tab ${
            // is this tab active?
            activeTab !== 0 ? 'ccl-l-tabs__tab--is-active' : ''
          }`}
          data-nw-tab="2"
          data-nw-tab-name={`${
            activeTab === 0 || activeTab === -1
              ? ''
              : `${tabs[activeTab].firstName} ${tabs[activeTab].lastName}`
          }`}
          data-nw-tab-number={dropdownLength}
          data-nw-tab-usertype={l.type}
        >
          <button
            type="button"
            className="ccl-l-tabs__tab__button"
            onClick={() => handleDropdown()}
          >
            <div className="ccl-l-tabs__tab__button__label">
              {activeTab === 0 || activeTab === -1 ? (
                <>
                  {/* show for mobile view only */}
                  <span className="ccl-l-tabs__tab__prompt is-hidden-tablet">
                    {l.promptTextAbbrv}
                  </span>
                  {/* show for tablet and up view */}
                  <span className="ccl-l-tabs__tab__prompt is-hidden-mobile">
                    {l.promptText}
                  </span>
                </>
              ) : (
                <>
                  <span className="ccl-l-tabs__tab__first-name">
                    {tabs[activeTab].firstName}
                  </span>
                  {/* hide for mobile view only */}
                  <span className="ccl-l-tabs__tab__last-name is-hidden-mobile">
                    {' '}
                    {tabs[activeTab].lastName}
                  </span>
                </>
              )}
            </div>
            <div className="ccl-l-tabs__tab__button__details">
              <span className="ccl-l-tabs__tab__button__details__length">
                {dropdownLength}
              </span>
              {/* hide for mobile view only */}
              <span className="ccl-l-tabs__tab__button__details__type is-hidden-mobile">
                &nbsp;{l.type}
              </span>
              <Icon
                color="interactive"
                type="expand-more"
                rotate={`${activeDropdown ? '180' : '0'}`}
              />
            </div>
          </button>
          <ul
            className={`ccl-l-tabs__tab__list ${
              activeDropdown ? 'ccl-l-tabs__tab__list--is-active' : ''
            }`}
          >
            {t.map(tab => {
              if (tab.tabIndex === 0) return null;
              // loop through recipient list
              return (
                <li
                  className={`ccl-l-tabs__tab__list__item ${
                    // is this tab active?
                    activeTab === tab.tabIndex
                      ? 'ccl-l-tabs__tab__list__item--is-active'
                      : ''
                  }`}
                  key={tab.tabIndex}
                >
                  <Link
                    data-nw-tab-list-option={tab.tabIndex}
                    onClick={e =>
                      disableLink
                        ? e.preventDefault()
                        : handleActiveTab(tab)
                    }
                    to={
                      disableLink
                        ? '#'
                        : `${location.pathname}?account=${accountId}&user=${tab.tabIndex}`
                    }
                    className={`ccl-l-tabs__tab__list__item__button ${
                      disableLink
                        ? 'ccl-l-tabs__tab__list__item__button--disabled'
                        : ''
                    }`}
                  >
                    {tab.firstName} {tab.lastName}
                    <Icon color="interactive" type="chevron-right" />
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    );
  };

  return (
    <div
      className={`ccl-l-tabs ${
        tabs.length === 1 ? 'ccl-l-tabs--single' : ''
      }`}
      {...props}
    >
      {tabsLayout(tabs, labels)}
      <div className="ccl-l-tabs__content">
        <Content
          {...props}
          data={content}
          activeTab={activeTab}
          activeUser={activeUser}
        />
      </div>
    </div>
  );
}

export default Tabs;

Tabs.propTypes = {
  data: PropTypes.objectOf(
    PropTypes.shape({
      tabsData: PropTypes.objectOf(
        PropTypes.shape({
          labels: PropTypes.objectOf(
            PropTypes.shape({
              promptText: PropTypes.string,
              promptTextAbbrv: PropTypes.string,
              type: PropTypes.string,
            }),
          ),
          tabs: PropTypes.arrayOf(
            PropTypes.shape({
              tabIndex: PropTypes.number,
              type: PropTypes.string,
              userId: PropTypes.string,
              firstName: PropTypes.string,
              lastName: PropTypes.string,
            }),
          ),
        }),
      ),
      content: PropTypes.objectOf(
        PropTypes.shape({
          text: PropTypes.string,
        }),
      ),
    }),
  ).isRequired,
  config: PropTypes.shape({
    isLoading: PropTypes.bool,
    callbackParent: PropTypes.func,
  }),
};

Tabs.defaultProps = {
  config: {
    isLoading: false,
    /* 
    A callback handler to the parent container when a tab user is changed
    */
    callbackParent: () => {},
  },
};
