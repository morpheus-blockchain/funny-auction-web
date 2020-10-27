import React, {useEffect, useState, useMemo} from 'react';

import styled, { keyframes } from 'styled-components';
import { Link } from 'umi';
import { Wallet, getSelectedAccount, getSelectedAccountWallet, WalletButton } from "wan-dex-sdk-wallet";
import "wan-dex-sdk-wallet/index.css";
import { withRouter } from 'umi';
import { connect } from 'react-redux';
import { getNodeUrl, isSwitchFinish, getFastWeb3 } from '../utils/web3switch.js';
import { useIntl } from 'umi';
import { CurrencyAmount } from '@wanswap/sdk';

function BasicLayout(props) {
  const [rpc, setRpc] = useState(undefined);
  const intl = useIntl();
  console.log('intl', intl);
  useEffect(() => {
    const func = async () => {
      await getFastWeb3();
      setRpc(getNodeUrl());
    }
    func();
  }, []);

  const balance = useMemo(()=>{
    if (!props.selectedAccount) {
      return "0";
    }
    return CurrencyAmount.ether(props.selectedAccount.get('balance')).toFixed(0);
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

  return (
    <Ground>
      {
        rpc
        ? <Wallet title="WanSwap" nodeUrl={rpc} />
        : null
      }

      <TopBar>
        <Logo>
        🏵
        </Logo>
        <Tab select>{intl.messages['funnyAuction']}</Tab>
        <Tab>{intl.messages['liquidity']}</Tab>
        <Tab>{intl.messages['gameRules']}</Tab>
        <Assets>{intl.messages['myAssets']+balance+' WAN'}</Assets>
        {
          rpc
          ? <WalletBt><WalletButton /></WalletBt>
          : null
        }
      </TopBar>
      <Title>{intl.messages['auctionBidFor']}</Title>
      <Circle>
        <p style={{fontSize:"58px"}}>100</p>
        <p style={{fontSize:"20px"}}>Wan Coins</p>
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
        demo.map((v, i)=>{
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

const TableHeader = (props) => {
  return(<div></div>);
}

const TableRow = (props) => {
  return(<div></div>);
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
    rgba(0, 0, 0, 0.6) 0%,
    rgba(158, 200, 155, 1) 50%,
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
  font-weight: ${props=>props.select?"bold":"normal"};
  color: ${props=>props.select?"#ffffffff":"#ffffffbb"};
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
  background-color: #e2d4b821;
  /* color: white; */
  margin-left: auto;
  margin-right: auto;
  text-align: center;
  width: 200px;
  margin-top: 0px;
  box-shadow: 0px 3px 10px #0000002f;
  cursor: pointer;
  :hover{
    background-color: #e2d4b881;
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
  width: ${props=>props.long ? "100px" : "60px"};
  text-align: center;
`;
