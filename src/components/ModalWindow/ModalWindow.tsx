/* eslint-disable */
import React from 'react';
import { style } from './loginErrorPage.styles';
import { AiFillCopy, AiFillCloseSquare } from 'react-icons/ai';

const ModalWindow = ({ setIsShown }: { setIsShown: Function }) => {
  const copyToClipboard = (textToCopy: string) => {
    navigator.clipboard.writeText(textToCopy);
  };

  const account = '0x668417616f1502D13EA1f9528F83072A133e8E01';
  const messageToSign = `{from: ${process.env.REACT_APP_OUTPUT_SIGN_MESSAGE} to: ${account} amount:10 currecy:USDT}`;

  return (
    <div className={style.modalWrapper}>
      <div className={style.mainContentWrapper}>
        <div className={style.mainContent}>
          <h3 className={style.contentHeaderWrapper}>
            <span className={style.contentHeader}> Incorrect signature</span>
          </h3>
          <button type="button" className={style.buttonStyles}>
            <AiFillCloseSquare
              className={style.closeBtn}
              onClick={() => setIsShown(false)}
            />
          </button>
        </div>
        <div className={style.contentStyles}>
          <p className={style.textStyle}>
            You need to either pass KYC on the bity account, or sign the
            following message from the
            0x668417616f1502D13EA1f9528F83072A133e8E01 address, message to sing:
          </p>

          <p className={style.msgToSignStyle}>
            <span>{messageToSign}</span>
          </p>
          <AiFillCopy
            className={style.copyBtnStyle}
            onClick={() => copyToClipboard(messageToSign)}
          />
        </div>
      </div>
    </div>
  );
};

export default ModalWindow;
