import { ethers } from 'ethers';
import logo from '../assets/logo.png';

import React from 'react'

const Navigation = ({currentAccount, setCurrentAccount}) => {

    const connectHandler = async () =>{
        const accounts = await window.ethereum.request({method: 'eth_requestAccounts'});
        const currentAccount = ethers.getAddress(accounts[0])
        setCurrentAccount(currentAccount);
    }

  return (
    <nav>
      <div className='nav__brand'>
        <img src={logo} className='logo' alt="Logo" />
        <h1>Crypto Daddy</h1>

        <ul className='nav__links'>
          <li><a href="/">Domain Names</a></li>
          <li><a href="/">Websites & Hosting</a></li>
          <li><a href="/">Commerce</a></li>
          <li><a href="/">Email & Marketing</a></li>
        </ul>
      </div>

      {currentAccount ? (
        <button
          type="button"
          className='nav__connect'
        >
          {currentAccount.slice(0, 6) + '...' + currentAccount.slice(38, 42)}
        </button>
      ) : (
        <button
          type="button"
          className='nav__connect'
          onClick={connectHandler}
        >
          Connect
        </button>
      )}
    </nav>  )
}

export default Navigation