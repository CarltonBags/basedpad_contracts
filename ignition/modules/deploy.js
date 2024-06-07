const {
    time,
    loadFixture,
  } = require("@nomicfoundation/hardhat-network-helpers");
  const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
  const { expect } = require("chai");
  const {ethers} = require("hardhat");


const main = {
    addresses:{
        base:{
            UniswapV2Factory: '0x8909Dc15e40173Ff4699343b6eB8132c65e18eC6',
            UniswapV2Router: '0x4752ba5dbc23f44d87826276bf6fd6b1c372ad24',
            WETH_USDC_PAIR: '0x88A43bbDF9D098eEC7bCEda4e2494615dfD9bB9C',
            factory: '',
            eventHandler:''
        },
        mainnet:{
            UniswapV2Factory: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f',
            UniswapV2Router: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
            WETH_USDC_PAIR: '0xB4e16d0168e52d35CaCD2c6185b44281Ec28C9Dc'

        },
        sepolia:{
            WETH_USDC_PAIR: "0x229F3Cbc14053b44696046b6E7E57A2375dB63Fe",
            UniswapV2Factory: '0xB7f907f7A9eBC822a80BD25E224be42Ce0A698A0',
            UniswapV2Router:'0x425141165d3DE9FEC831896C016617a52363b687'
        },
        bnb_testnet:{
            WETH_USDC_PAIR: "0xa8B8cb1C5c9e13C3af86cc8aa5f0297Db69b099C",
            SushiSwapV2Factory: "0xc35DADB65012eC5796536bD9864eD8773aBc74C4",
            SushiSwapV2Router: "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506",
            factory: '0x313892f6791598D89D6C21C7000De32031462788',
            eventHandler:'0x73494f4c3238AFf66eCfc6B1D020872e513Bb95a',
            deployedToken:"0xD22C19647Eec708B88748De0B98b3bdF1eE08cED"

        }
    },
    deploy:
        async () => {
            try {
                const privateKey = process.env.PRIVATE_KEY;
                const wallet = new ethers.Wallet(privateKey, ethers.provider); 
                
                console.log("Deploying contracts with the account:", wallet.address);

                const initialFee = ethers.utils.parseUnits("0.002", "ether")
                const a = ethers.utils.parseUnits("0.000000001", "ether")
                const b = ethers.utils.parseUnits("0.0000000001", "ether")

                const Factory = await ethers.getContractFactory("Factory", wallet)
                const factory = await Factory.deploy(initialFee, {gasLimit: 3000000, gasPrice: ethers.utils.parseUnits('20', 'gwei')})
                await factory.deployed()
                console.log("factory address", factory.address)

                const EventHandler = await ethers.getContractFactory("EventHandler", wallet)
                const eventHandler = await EventHandler.deploy(factory.address, {gasLimit: 3000000, gasPrice: ethers.utils.parseUnits('20', 'gwei')})
                await eventHandler.deployed()
                console.log("event handler address", eventHandler.address)

                await factory.setEventHandler(eventHandler.address, {gasLimit: 3000000, gasPrice: ethers.utils.parseUnits('20', 'gwei')})
                await factory.setA(a, {gasLimit: 3000000, gasPrice: ethers.utils.parseUnits('20', 'gwei')})
                await factory.setB(b, {gasLimit: 3000000, gasPrice: ethers.utils.parseUnits('20', 'gwei')})
            }
            catch (error){
                console.log("error", error)
            }
    },
    launch:
        async () => {
            try{
                const params = ["0x73494f4c3238AFf66eCfc6B1D020872e513Bb95a", "0xa8B8cb1C5c9e13C3af86cc8aa5f0297Db69b099C", "0xc35DADB65012eC5796536bD9864eD8773aBc74C4", "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506"]
                const a = ethers.utils.parseUnits("0.000001", "ether"); // This equals 10 ** 17 wei
                const b = ethers.utils.parseUnits("0.0000002", "ether"); // This equals 10 ** 17 wei
                const goal = ethers.utils.parseUnits("0.01", "ether"); // This equals 10 ** 17 wei
                const initialFee = ethers.utils.parseUnits("0.002", "ether")

                const privateKey = process.env.PRIVATE_KEY;
                const wallet = new ethers.Wallet(privateKey, ethers.provider); 
            
                console.log("wallet creating new Token", wallet.address);

                Factory = await ethers.getContractAt("Factory", "0x313892f6791598D89D6C21C7000De32031462788");
                const caller = Factory.connect(wallet)

                //const response = await caller.setActive({gasLimit: 3000000, gasPrice: ethers.utils.parseUnits('20', 'gwei')})

                const response = await caller.deployNewToken(params, "hello", "HELL", "dis just a test", goal, {gasLimit: 3000000, gasPrice: ethers.utils.parseUnits('20', 'gwei'), value: initialFee})
                
                console.log("response", response)

            }
            catch(error){
                console.log("error creating new token", error)
            }
        },
    buy: 
        async () => {
            const privateKey = process.env.PRIVATE_KEY;
            const wallet = new ethers.Wallet(privateKey, ethers.provider); 

            const buyAmount= ethers.utils.parseEther("0.001")
            const minTokens= "10"

            TokenContract = await ethers.getContractAt("Token", "0xD22C19647Eec708B88748De0B98b3bdF1eE08cED")
            const caller = TokenContract.connect(wallet)

            const response = await caller.buy(minTokens, {gasLimit: 300000, gasPrice: ethers.utils.parseUnits('300', 'gwei'), value: buyAmount})
            console.log("response", response)
        }

    
}



/*main.deploy()
.then(() => process.exit(0))
.catch(error => {
    console.error(error);
    process.exit(1);
});*/


/*main.launch()
.then(() => process.exit(0))
.catch(error => {
    console.error(error);
    process.exit(1);
});*/

main.buy()
.then(() => process.exit(0))
.catch(error => {
    console.error(error);
    process.exit(1);
});