import { useEffect, useState } from 'react'
import { ethers } from 'ethers'

const Domain = ({ domain, cryptodaddyContract, provider, id }) => {
    const [owner, setOwner] = useState(null)
    const [hasSold, setHasSold] = useState(false)
    const getOwner = async () => {
        if (domain.isAvailable || hasSold) {
          const owner = await cryptodaddyContract.ownerOf(id)
          setOwner(owner)
        }
      }
    
    const buyHandler = async () =>{
        const signer = await provider.getSigner()
        console.log(`signer: ${signer}`)
        const transaction = await cryptodaddyContract.connect(signer).mint(id, {value: domain.cost})
        await transaction.wait()

        setHasSold(true)
    }

    useEffect(() => {
        getOwner()
      }, [hasSold])

  return (
    <div className='card'>
      <div className='card__info'>
        <h3>
          {domain.isAvailable || owner ? (
            <del>{domain.name}</del>
          ) : (
            <>{domain.name}</>
          )}
        </h3>

        <p>
          {domain.isAvailable || owner ? (
            <>
              <small>
                Owned by:<br />
                <span>
                  {owner && owner.slice(0, 6) + '...' + owner.slice(38, 42)}
                </span>
              </small>
            </>
          ) : (
            <>
              <strong>
                {ethers.formatUnits(domain.cost.toString(), 'ether')}
              </strong>
              ETH
            </>
          )}
        </p>
      </div>

      {!domain.isAvailable && !owner && (
        <button
          type="button"
          className='card__button'
          onClick={() => buyHandler()}
        >
          Buy It
        </button>
      )}
    </div>
  )
}

export default Domain