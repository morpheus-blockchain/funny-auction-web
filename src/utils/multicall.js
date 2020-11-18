import { aggregate } from '@makerdao/multicall';
import * as scAddr from './address/index';

export async function getFunnyAuctionInfo(rpc, chainId, account) {
  if (!rpc || !chainId) {
    return undefined;
  }

  const funnySc = scAddr.FUNNY_AUCTION_ADDR[Number(chainId).toString()];
  const config = {
    rpcUrl: rpc,
    multicallAddress: scAddr.MULTI_CALL_ADDR[Number(chainId).toString()]
  };

  const calls = [
    {
      target: funnySc,
      call: ['getStatus()(uint256)'],
      returns: [['status', val => Number(val)]]
    },
    {
      target: funnySc,
      call: ['currentGoodValue()(uint256)'],
      returns: [['goodsValue', val => val / 10 ** 18]]
    },
    {
      target: funnySc,
      call: ['percent()(uint256)'],
      returns: [['percent', val => Number(val)]]
    },
    {
      target: funnySc,
      call: ['calcGoodsValue()(uint)'],
      returns: [['calcGoodsValue', val => val / 10 ** 18]]
    },
    {
      target: funnySc,
      call: ['getPlayersInfo()(address[], uint256[])'],
      returns: [['players'], ['bids', val => val.map(v => v / 10 ** 18)]]
    },
    {
      target: funnySc,
      call: ['liquidityPool()(uint256)'],
      returns: [['liquidityPool', val => val / 10 ** 18]]
    },
    {
      target: funnySc,
      call: ['totalSupply()(uint256)'],
      returns: [['totalSupply', val => val / 10 ** 18]]
    },
    {
      target: funnySc,
      call: ['lastOfferBlock()(uint256)'],
      returns: [['lastOfferBlock', val => Number(val)]]
    },
    {
      target: funnySc,
      call: ['currentBidPrice()(uint256)'],
      returns: [['currentBidPrice', val => val / 10 ** 18]]
    },
    {
      target: funnySc,
      call: ['topPlayer()(address)'],
      returns: [['topPlayer']]
    },
    {
      target: funnySc,
      call: ['secondPlayer()(address)'],
      returns: [['secondPlayer']]
    },
    {
      target: funnySc,
      call: ['coldDownBlock()(uint256)'],
      returns: [['coldDownBlock', val => Number(val)]]
    },
    {
      target: funnySc,
      call: ['confirmBlock()(uint256)'],
      returns: [['confirmBlock', val => Number(val)]]
    },
  ];

  if (account) {
    calls.push({
      target: funnySc,
      call: ['balanceOf(address)(uint256)', account],
      returns: [['myLiquidity', val => val / 10 ** 18]]
    })
  }

  let ret = await aggregate(calls, config);
  console.debug('sc info', ret);
  return ret;
}
