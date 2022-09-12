import React, { FC, useState } from "react";
import { AiOutlineDown } from 'react-icons/ai'
import EthLogo from "../../assets/eth.png"
import BtcLogo from "../../assets/btc.png"
import { BsCurrencyExchange } from 'react-icons/bs'
import { style } from "./exchangePage.styles";

const ExchangePage: FC = () => {
    const [fromValue, setFromValue] = useState<number>()
    const [toValue, setToValue] = useState<number>()

    return (
        <div className={style.wrapper}>
            <div className={style.content}>
                <div className={style.formHeader}>
                    <div>Exchange </div>
                    <BsCurrencyExchange/>
                </div>
                <div className={style.transferPropContainer}>
                    <input
                        type='number'
                        className={style.transferPropInput}
                        placeholder='You SEND'
                        onChange={e => setFromValue(+e.target.value)}
                    />
                    <div className={style.currencySelector}>
                        <div className={style.currencySelectorContent}>
                            <div className={style.currencySelectorIcon}>
                                <img src={EthLogo} alt="" />
                            </div>
                            <div className={style.currencySelectorTicker}>ETH</div>
                        </div>
                    </div>
                </div>
                <div className={style.transferPropContainer} >
                    <input
                        type='number'
                        className={style.transferPropInput}
                        placeholder='You GET'
                        onChange={e => setToValue(+e.target.value)}
                    />
                    <div className={style.currencySelector}>
                        <div className={style.currencySelectorContent}>
                            <div className={style.currencySelectorIcon}>
                                <img src={BtcLogo} alt="" />
                                <AiOutlineDown className={style.currencySelectorArrow} />
                            </div>
                            <div className={style.currencySelectorTicker}>BTC</div>
                        </div>
                    </div>

                </div>
                <ul className={style.ulStyles}> 
                    <li className={style.liStyles}>Trading fee: 1.60 CFH</li>
                    <li className={style.liStyles}>Cryptocurrency transaction cost 0.000025 BTC</li>
                    <li className={style.liStyles}>Exchange rate 0.077/1</li>
                </ul>
                
                <div onClick={() => alert('click')} className={style.confirmButton}>
                    Exchange
                </div>
            </div>

        </div>
    )
}

export default ExchangePage;