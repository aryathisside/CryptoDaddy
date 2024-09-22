const hre = require("hardhat")

const tokens = (n) => {
    return ethers.parseUnits(n.toString(), 'ether')
}

async function main() {
    // Setup accounts & variables
    const [deployer] = await ethers.getSigners()
    let CryptoDaddyContract
    NAME = "CryptoDaddy"
    SYMBOL = "C-D"

    const CryptoDaddy = await ethers.getContractFactory("CryptoDaddy")
    CryptoDaddyContract = await CryptoDaddy.deploy(NAME, SYMBOL, deployer)
    const CryptoDaddyAddress = await CryptoDaddyContract.getAddress()
    console.log(`Contract deployed to: ${CryptoDaddyAddress}\n`)

    // List 6 domains
    const domains = ["jack.eth", "john.eth", "henry.eth", "cobalt.eth", "oxygen.eth", "carbon.eth"]
    const costs = [tokens(10), tokens(25), tokens(15), tokens(2.5), tokens(3), tokens(1)]

    for(var i = 0; i < 6 ; i++){
        const transaction = await CryptoDaddyContract.connect(deployer).list(domains[i], costs[i])
        await transaction.wait()

        console.log(`Listed Domain ${i + 1}: ${domains[i]}`)
    }

}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});