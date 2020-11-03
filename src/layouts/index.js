import React, { useEffect, useState, useMemo } from 'react';

import styled, { keyframes } from 'styled-components';
import { Link } from 'umi';
import { Wallet, getSelectedAccount, getSelectedAccountWallet, WalletButton } from "wan-web-wallet";
import "wan-web-wallet/index.css";
import { withRouter } from 'umi';
import { connect } from 'react-redux';
import { getNodeUrl, isSwitchFinish, getFastWeb3 } from '../utils/web3switch.js';
import { useIntl, getLocale } from 'umi';
import { CurrencyAmount } from '@wanswap/sdk';
import { Modal, Input } from 'antd';
import Web3 from 'web3';
import * as utils from '../utils/utils';
import "./index.css";

console.log('getLocale', getLocale());

function BasicLayout(props) {
  const [rpc, setRpc] = useState(undefined);
  const intl = useIntl();

  useEffect(() => {
    const func = async () => {
      await getFastWeb3();
      setRpc(getNodeUrl());
    }
    func();
  }, []);

  const balance = useMemo(() => {
    if (!props.selectedAccount) {
      return "0";
    }
    return Number(Web3.utils.fromWei(props.selectedAccount.get('balance').toFixed(0))).toFixed(0);
  }, [props.selectedAccount]);

  const demo = [
    {
      rank: 1,
      address: '0x4Cf0...7D9e',
      status: 'Winner',
      pay: '15 WAN',
      return: '85 WAN',
    },
    {
      rank: 2,
      address: '0x4Cf0...7D9e',
      status: 'Loser',
      pay: '14 WAN',
      return: '0 WAN',
    },
    {
      rank: 3,
      address: '0x4Cf0...7D9e',
      status: '',
      pay: '10 WAN',
      return: '10 WAN',
    },
    {
      rank: 4,
      address: '0x4Cf0...7D9e',
      status: '',
      pay: '8 WAN',
      return: '8 WAN',
    },
  ]

  const [showLiquidity, setShowLiquidity] = useState(false);
  const [showDeposit, setShowDeposit] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [showGameRule, setShowGameRule] = useState(false);


  return (
    <Ground>
      {
        rpc
          ? <Wallet title="WanSwap" nodeUrl={rpc} />
          : null
      }
      <LiquidityModal visible={showLiquidity}
        onCancel={() => { setShowLiquidity(false) }}
        onDeposit={() => {
          setShowLiquidity(false);
          setShowDeposit(true);
        }}
        onWithdraw={() => {
          setShowLiquidity(false);
          setShowWithdraw(true);
        }} />
      <InputModal visible={showDeposit}
        onCancel={() => { setShowDeposit(false); }}
        title={intl.messages['depositLiquidity']}
        text={intl.messages['depositAmount']}
        symbol="WAN"
        />
      <InputModal visible={showWithdraw}
        onCancel={() => { setShowWithdraw(false); }}
        title={intl.messages['withdrawLiquidity']}
        text={intl.messages['withdrawAmount']}
        symbol="FAP"
        />
      <GameRuleModal visible={showGameRule} onCancel={()=>{setShowGameRule(false)}}/>
      <TopBar>
        <Logo>
          🏵
        </Logo>
        <Tab select>{intl.messages['funnyAuction']}</Tab>
        <Tab onClick={() => { setShowLiquidity(true) }}>{intl.messages['liquidity']}</Tab>
        <Tab onClick={() => { setShowGameRule(true) }}>{intl.messages['gameRules']}</Tab>
        <Assets>{intl.messages['myAssets'] + balance + ' WAN'}</Assets>
        {
          rpc
            ? <WalletBt><WalletButton /></WalletBt>
            : null
        }
      </TopBar>
      <Title>{intl.messages['auctionBidFor']}</Title>
      <Coin />
      <Circle>
        <p style={{ fontSize: "58px" }}>100</p>
        <p style={{ fontSize: "20px" }}>Wan Coins</p>
      </Circle>
      <SmallTitle>{intl.messages['currentPrice'] + "0 WAN"}</SmallTitle>
      <MainButton>{intl.messages['startGame']}</MainButton>
      <Title>{intl.messages['lastRoundRank']}</Title>
      <Header>
        <Cell>{intl.messages['rank']}</Cell>
        <Cell long>{intl.messages['address']}</Cell>
        <Cell>{intl.messages['status']}</Cell>
        <Cell>{intl.messages['pay']}</Cell>
        <Cell>{intl.messages['return']}</Cell>
      </Header>
      {
        demo.map((v, i) => {
          return (<Row>
            <Cell>{v.rank}</Cell>
            <Cell long>{v.address}</Cell>
            <Cell>{v.status}</Cell>
            <Cell>{v.pay}</Cell>
            <Cell>{v.return}</Cell>
          </Row>);
        })
      }
    </Ground>
  );
}

export default withRouter(connect(state => {
  const selectedAccountID = state.WalletReducer.get('selectedAccountID');
  return {
    selectedAccount: getSelectedAccount(state),
    selectedWallet: getSelectedAccountWallet(state),
    networkId: state.WalletReducer.getIn(['accounts', selectedAccountID, 'networkId']),
    selectedAccountID,
  }
})(BasicLayout));

const LiquidityModal = (props) => {
  const intl = useIntl();

  return (
    <StyledModal
      visible={props.visible}
      onCancel={props.onCancel}
      footer={null}
    >
      <ModalTitle>{intl.messages['liquidity']}</ModalTitle>
      <ModalH1>{intl.messages['totalLiquidity']}:</ModalH1>
      <BigLabel>1205 WAN</BigLabel>
      <ModalH1>{intl.messages['myLiquidity']}:</ModalH1>
      <SmallLabel>13.5 FAP / 13.5% / 35 WAN</SmallLabel>
      <MainButton onClick={props.onDeposit}>{intl.messages['deposit']}</MainButton>
      <MainButton onClick={props.onWithdraw}>{intl.messages['withdraw']}</MainButton>
    </StyledModal>
  );
}

const InputModal = (props) => {
  const intl = useIntl();
  return (
    <StyledModal
      visible={props.visible}
      onCancel={props.onCancel}
      footer={null}
    >
      <ModalTitle>{props.title}</ModalTitle>
      <ModalH1>{props.text}:</ModalH1>
      <StyledInput suffix={props.symbol}/>
      <MainButton onClick={props.onOk}>{intl.messages['ok']}</MainButton>
      <MainButton onClick={props.onCancel}>{intl.messages['cancel']}</MainButton>
    </StyledModal>
  );
}

const GameRuleModal = (props) => {
  const intl = useIntl();
  return (
    <StyledModal
      visible={props.visible}
      onCancel={props.onCancel}
      footer={null}
    >
      <ModalTitle>{intl.messages['gameRule']}</ModalTitle>
      <ModalH2>{intl.messages['gameRule1']}</ModalH2>
      <ModalH2>{intl.messages['gameRule2']}</ModalH2>
      <ModalH2>{intl.messages['gameRule3']}</ModalH2>
      <ModalH2>{intl.messages['gameRule4']}</ModalH2>
      <ModalH2>{intl.messages['gameRule5']}</ModalH2>
      <ModalH2>{intl.messages['gameRule6']}</ModalH2>
      <ModalH2>{intl.messages['gameRule7']}</ModalH2>
      <ModalH2>{intl.messages['gameRule8']}</ModalH2>
      <ModalH2>{intl.messages['gameRule9']}</ModalH2>
      <a href="https://github.com/morpheus-blockchain/funny-auction-web" style={{marginLeft: "20px"}}>Github</a>

      <MainButton onClick={props.onCancel} style={{marginTop:"40px"}}>{intl.messages['ok']}</MainButton>
    </StyledModal>
  );
}

const Coin = (props) => {
  return (
    <div className='coin'>
      <div className='front jump'>
        <div className='star'></div>
        <span className='currency'>100</span>
        <div className='shapes'>
          <div className='shape_l'></div>
          <div className='shape_r'></div>
          <span className='top'></span>
          <span className='bottom'>WAN</span>
        </div>
      </div>
      <div className='shadow'></div>
    </div>);
}


const RainbowLight = keyframes`
	0% {
		background-position: 0% 50%;
	}
	50% {
		background-position: 100% 50%;
	}
	100% {
		background-position: 0% 50%;
	}
`

const Ground = styled.div`
  background: linear-gradient(
    45deg,
    rgba(200, 200, 200, 1) 0%,
    rgba(158, 200, 155, 0.8) 50%,
    rgba(255, 203, 57, 1) 100%
  );
  background-size: 400% 400%;
  background-position: 50%;
  /* animation: ${RainbowLight} 20s linear infinite; */
  height: 100%;
  width: 100%;
  /* padding-bottom: 40px; */
`;

const TopBar = styled.div`
  width: 100%;
  height: 60px;
  background-color: #00000020;
  margin: 0px;
  display:flex;
  justify-content: start;
`;

const Logo = styled.div`
  padding: 6px;
  margin-right: 10px;
  font-size: 32px;
  margin-left: 10px;
`;

const Tab = styled(Link)`
  text-align: center;
  width: 120px;
  padding: 8px;
  margin: 6px;
  font-size: 22px;
  font-weight: ${props => props.select ? "bold" : "normal"};
  color: ${props => props.select ? "#ffffffff" : "#ffffffbb"};
`;

const Assets = styled.div`
  cursor: pointer;
  border-radius: 25px;
  height: 36px;
  margin-left: auto;
  margin-right: 20px;
  /* border: 1px solid white; */
  margin-top: 12px;
  padding: 3px 20px 2px 20px;
  background-color: #1700ff45;
  color: white;
  line-height: 30px;

`

const WalletBt = styled.div`
  border: 1px solid white;
  border-radius: 25px;
  margin: 12px;
  margin-left: 10px;
  margin-right: 20px;
  padding: 2px;
  button {
    background: transparent;
    border: none;
    height: 30px;
    /* width: 220px; */
    font-family: Roboto Condensed;
    font-size: 16px;
    :hover {
      background-color: transparent!important;
    }
  }
`;

const Title = styled.div`
  font-size: 20px;
  line-height: 20px;
  /* border-radius: 10px; */
  height: 50px;
  padding: 16px 20px 15px 20px;
  /* background-color: #e2d4b821; */
  /* color: white; */
  margin-left: auto;
  margin-right: auto;
  text-align: center;
  width: 200px;
  margin-top: 20px;
  border-bottom: 1px solid #909018;
  /* box-shadow: 0px 3px 10px #0000002f; */

`

const Circle = styled.div`
  font-size: 64px;
  line-height: 6px;
  border-radius: 50%;
  height: 200px;
  padding: 76px 20px 15px 20px;
  background-color: #86b1b0;
  color: #ffcf86;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
  width: 200px;
  margin-top: 20px;
  box-shadow: 0px 0px 20px rgb(200 236 144);
  background: radial-gradient(100% 90% at 20% 0%,#f7f1aa 0%,#524814 100%);
  opacity: 0;
`

const SmallTitle = styled.div`
  font-size: 16px;
  line-height: 16px;
  height: 40px;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
  width: 200px;
  margin-top: 20px;
`;

const MainButton = styled.div`
  font-size: 20px;
  line-height: 20px;
  border-radius: 30px;
  height: 50px;
  padding: 16px 20px 15px 20px;
  background-color: #b8fdb6b3;
  /* color: white; */
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 10px;
  text-align: center;
  width: 200px;
  margin-top: 0px;
  box-shadow: 0px 3px 10px #0000002f;
  cursor: pointer;
  :hover{
    background-color: #eeffff;
    box-shadow: 0px 3px 10px #ffff338f;
  }
`;

const Header = styled.div`
  width: 600px;
  height: 30px;
  display: flex;
  justify-content: space-around;
  text-align: center;
  margin-left: auto;
  margin-right: auto;
  margin-top: 20px;
  border-bottom: 1px solid #24633b5e;
`;

const Row = styled.div`
  width: 600px;
  height: 30px;
  display: flex;
  justify-content: space-around;
  text-align: center;
  margin-left: auto;
  margin-right: auto;
  margin-top: 20px;
  border-bottom: 1px solid #6463002e;
`;

const Cell = styled.div`
  width: ${props => props.long ? "100px" : "60px"};
  text-align: center;
`;

const StyledModal = styled(Modal)`
  .ant-modal-content {
    border-radius: 15px;
    background:rgba(189 239 218 / 90%);
  }
`;

const ModalTitle = styled.div`
  width: 100%;
  text-align: center;
  font-size: 22px;
  line-height: 22px;
  padding: 10px;
  font-weight: bold;
  margin-bottom: 40px;
`;

const ModalH1 = styled.div`
  margin: 10px;
  font-size: 18px;
  margin-left: 40px;
`;

const ModalH2 = styled.div`
  margin: 10px;
  font-size: 14px;
`;

const BigLabel = styled.div`
  width: 100%;
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  padding-bottom: 16px;
`;

const SmallLabel = styled(BigLabel)`
  font-size: 20px;
  line-height: 52px;
`;

const StyledInput = styled(Input)`
  border-radius: 15px;
  margin-left: 40px;
  margin-right: auto;
  width: 400px;
  margin-top: 10px;
  margin-bottom: 60px;
  .ant-input {
    text-align: center;
  }
`;
