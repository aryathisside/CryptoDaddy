const { expect } = require("chai");
const { ethers } = require("hardhat");

const tokens = (n) => {
  return ethers.parseUnits(n.toString(), 'ether')
}

describe('CryptoDaddy', () => { 
    let deployer, CryptoDaddyContract,CryptoDaddyAddress, owner1;
    NAME = "CryptoDaddy"
    SYMBOL = "C-D"
    beforeEach(async() =>{
        [deployer,owner1] = await ethers.getSigners()

        console.log(`deployer: ${deployer.address}`)

        const CryptoDaddy = await ethers.getContractFactory("CryptoDaddy")
        CryptoDaddyContract = await CryptoDaddy.deploy(NAME, SYMBOL, deployer)
        CryptoDaddyAddress = await CryptoDaddyContract.getAddress()

        console.log(`CryptoDaddyAddress: ${CryptoDaddyAddress}`)

        const transaction = await CryptoDaddyContract.connect(deployer).list("Jack.eth",tokens(10))
        await transaction.wait()
    })


    describe('Deployment', () => {  
        it('should return the correct Name', async () => {
            const result = await CryptoDaddyContract.name()
            expect(result).to.be.equal(NAME)
        })

        it("should return the correct Symbol",async() =>{
            const result = await CryptoDaddyContract.symbol()
            expect(result).to.be.equal(SYMBOL)
        })

        it("Deployer is Owner",async() =>{
            const result = await CryptoDaddyContract.owner()
            expect(result).to.be.equal(deployer.address)
        })

        it("Max Suppy",async() =>{
            const result = await CryptoDaddyContract.MAX_SUPPLY()
            expect(result).to.be.equal(10000)
        })
     })


     describe("Listing", () =>{
        it("MaxSupply",async() =>{
            const result = await CryptoDaddyContract.maxSupply()
            expect(result).to.be.equal(1)
        })

        it("Domain Name", async()=>{
            const domain = await CryptoDaddyContract.getDomain(1)
            expect(domain.name).to.be.equal("Jack.eth")
            expect(domain.cost).to.be.equal(tokens(10))
            expect(domain.isAvailable).to.be.equal(false)
        })
     })

     describe('Minting', () => {
        const ID = 1
        const AMOUNT = ethers.parseUnits('10', 'ether')

        beforeEach(async() =>{
            const transaction = await CryptoDaddyContract.connect(owner1).mint(ID, {value:AMOUNT})
            await transaction.wait()
        })

        it("Check Owner", async () => {
            const owner = await CryptoDaddyContract.ownerOf(ID)
            expect(owner).to.be.equal(owner1.address)
        })

        it("Domain Available", async() =>{
            const domain = await CryptoDaddyContract.getDomain(ID)
            expect(domain.isAvailable).to.be.equal(true)
        })

        it("Contract Balance", async() => {
            const Balance = await CryptoDaddyContract.getBalance()
            expect(Balance).to.be.equal(tokens(10))
        })
      })

      describe('Withdrawing', () => { 
        const ID = 1
        const AMOUNT = ethers.parseUnits('10', 'ether')
        let balanceBefore

        beforeEach(async() =>{
            balanceBefore = await ethers.provider.getBalance(deployer.address)
            let transaction = await CryptoDaddyContract.connect(owner1).mint(ID, {value:AMOUNT})
            await transaction.wait()

            transaction = await CryptoDaddyContract.connect(deployer).withdraw()
            await transaction.wait()
        })

        it("Deployer Balance", async() =>{
            const deployerBalance = await ethers.provider.getBalance(deployer.address)
            expect(deployerBalance).to.be.greaterThan(balanceBefore)
        })

        it("Contract Balance", async() =>{
            const contractBalance = await CryptoDaddyContract.getBalance()
            expect(contractBalance).to.be.equal(tokens(0))
        })
       })

 })
