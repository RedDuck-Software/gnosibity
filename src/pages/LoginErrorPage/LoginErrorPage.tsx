import React, { FC } from 'react';
import { BiError } from 'react-icons/bi';

import { style } from './loginErrorPage.styles';

const ErrorPage: FC = () => {
  return (
    <div className={style.mainWrapper}>
      <div className={style.mainContentWrapper}>
        <div className={style.mainContent}>
          <div className={style.contentHeaderWrapper}>
            <h1 className={style.contentHeader}>Incorrect entrance</h1>
            <h1 className={style.contentHeader}>
              <BiError />
            </h1>
          </div>

          <h6 className={style.errorWrapper}>
            <span className={style.redText}>Oops!</span> Seems like you are
            trying to enter via
            <p>{process.env.REACT_APP_GONOSIS_AUTH_ERROR}</p>
            <p className={style.followSteps}>Follow next steps to login :</p>
          </h6>

          <div>
            <ul className={style.ulStyles}>
              <li className={style.liStyles}>
                Follow the{' '}
                <a href="" className={style.linkStyle}>
                  link
                </a>
              </li>
              <li className={style.liStyles}>Log-in there</li>
              <li className={style.liStyles}>
                Try to enter Gnosis-safe app again
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
