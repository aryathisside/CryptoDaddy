import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import Navigation from './components/Navigation';

//ABI
import CryptodaddyABI from './abis/cryptodaddy.json'

// Config
import config from './config.json'
import Search from './components/Search';
import Domain from './components/Domain';

function App() {
  const [currentAccount, setCurrentAccount] = useState(null)
  const [provider, setProvider] = useState(null)

  const [cryptodaddyContract, setCryptodaddyContract] = useState(null)
  const [domains, setDomains] = useState([])

  const localBlockchainData = async () =>{
 try {
      if (window.ethereum == null) {
        console.log("MetaMask not installed; using read-only defaults");
        const provider = ethers.getDefaultProvider();
        setProvider(provider);
      } else {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signerAcc = await provider.getSigner();

        // console.log("signer", signerAcc)
        setProvider(provider);

        // Get the network
        const network = await provider.getNetwork();
        const chainIdString = network.chainId.toString();
        // console.log("chainIdString", chainIdString)
        // console.log("network-chainId", network.chainId)
        // console.log("network", network)

        //Contract Deployment
        const cryptodaddyContract = new ethers.Contract(config[chainIdString].cryptodaddy.address, CryptodaddyABI, provider)
        const cryptodaddyAddress = await cryptodaddyContract.getAddress()
        console.log(`Cryptodaddy Address: ${config[chainIdString].cryptodaddy.address}`)
        console.log(`Cryptodaddy Address: ${config[chainIdString].cryptodaddy.address}`)
        setCryptodaddyContract(cryptodaddyContract)

        const maxSupply = await cryptodaddyContract.maxSupply()
        const domains = []

        for (var i = 1; i <= maxSupply; i++) {
          const domain = await cryptodaddyContract.getDomain(i)
          domains.push(domain)
        }
    
        setDomains(domains)

        window.ethereum.on("accountsChanged", async () => {
          const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
          const account = ethers.getAddress(accounts[0]);
          setCurrentAccount(account);
        });
      }
    } catch (error) {
      console.log("Error", error)
    }
  }

  useEffect(() => {
    localBlockchainData()
  }, [])

  return (
    <div>
      <Navigation currentAccount={currentAccount} setCurrentAccount={setCurrentAccount}/>
      <Search />

      <div className='cards__section'>
        <h2 className='cards__title'>Why you need a domain name.</h2>
        <p className='cards__description'>
          Own your custom username, use it across services, and
          be able to store an avatar and other profile data.
       </p>

        <hr />

        <div className='cards'>
          {domains.map((domain, index) => (
            <Domain domain={domain} cryptodaddyContract={cryptodaddyContract} provider={provider} id={index + 1} key={index} />
          ))}
        </div>
      </div>

    </div>
  );
}

export default App;
