import Web3 from 'web3';
import scAbi from './abi/FunnyAuction.json';
import * as scAddr from './address/index';

export const addLiquidity = async (value, account, wallet, chainId) => {
  const funnySc = scAddr.FUNNY_AUCTION_ADDR[Number(chainId).toString()];

  const txParam = {
    gasPrice: '0x3B9ACA00', // 1e9
    to: funnySc,
    value: '0x' + Web3.utils.toBN(Web3.utils.toWei(value.toString())).toString('hex'),
    data: '0x',
  }

  const txHash = await wallet.sendTransaction(txParam);
  console.log('txHash', txHash);
  return txHash;
}

export const withdraw = async (wallet, chainId) => {
  const data = '0x3ccfd60b'; //withdraw();
  const funnySc = scAddr.FUNNY_AUCTION_ADDR[Number(chainId).toString()];

  const txParam = {
    gasPrice: '0x3B9ACA00', // 1e9
    to: funnySc,
    value: '0x0',
    data,
  }

  const txHash = await wallet.sendTransaction(txParam);
  console.log('txHash', txHash);
  return txHash;
}

export const claim = async (wallet, chainId) => {
  const data = '0x4e71d92d'; //claim();
  const funnySc = scAddr.FUNNY_AUCTION_ADDR[Number(chainId).toString()];

  const txParam = {
    gasPrice: '0x3B9ACA00', // 1e9
    to: funnySc,
    value: '0x0',
    data,
  }

  const txHash = await wallet.sendTransaction(txParam);
  console.log('txHash', txHash);
  return txHash;
}
