import * as providers from '@ethersproject/providers';
import React, { FC } from 'react';

import { style } from '../../pages/ExchangePage/exchangePage.styles';

interface SignMessageProps {
  messageToSign: string;
  onChange: (signature: string) => void | Promise<void>;
  onVerify: () => void | Promise<void>;
  onSignMessage: () => void | Promise<void>;
  connectWallet: () => void | Promise<void>;
  signature: string;
  provider: providers.Web3Provider | undefined;
}

export const SignMessage: FC<SignMessageProps> = ({
  messageToSign,
  onChange,
  onVerify,
  onSignMessage,
  signature,
  provider,
  connectWallet,
}) => {
  return (
    <div>
      <div style={{ marginTop: '2rem' }}>
        <span>
          <b>Message to sign:</b>
          <button
            type="button"
            className={style.copyButton}
            style={{
              display: 'inline-block',
            }}
            onClick={() => navigator.clipboard.writeText(messageToSign)}
          >
            Copy
          </button>
        </span>
        <textarea
          style={{
            width: '100%',
            height: '200px',
            padding: '10px',
            marginTop: '5px',
          }}
          defaultValue={messageToSign}
        ></textarea>
      </div>
      <div style={{ marginTop: '0.5rem' }}>
        <span>
          <b>Insert signature:</b>
        </span>
        <input
          style={{
            width: '100%',
            padding: '10px',
            marginTop: '5px',
          }}
          type="text"
          placeholder="Signature..."
          value={signature}
          onChange={(e) => onChange(e.target.value)}
        />
        <div className="flex gap-1">
          <button className={style.copyButton} onClick={onVerify}>
            Verify signature
          </button>
          {provider ? (
            <button className={style.copyButton} onClick={onSignMessage}>
              Sign through wallet
            </button>
          ) : (
            <button className={style.copyButton} onClick={connectWallet}>
              Connect metamask
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
