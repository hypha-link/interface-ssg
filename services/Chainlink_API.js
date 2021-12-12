const { ethers } = require("ethers")

const MAINNET_API_KEY = process.env.NEXT_PUBLIC_MAINNET_API_KEY
    
//Non-ETH Pairs - 8 Decimals
export const tokenAddr = new Map();
tokenAddr.set("BTC", "0xF4030086522a5bEEa4988F8cA5B36dbC97BeE88c")
tokenAddr.set("ETH", "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419")
tokenAddr.set("LINK", "0x2c1d072e956AFFC0D435Cb7AC38EF18d24d9127c")
tokenAddr.set("AAVE", "0x547a514d5e3769680Ce22B2361c10Ea13619e8a9")
tokenAddr.set("UNI", "0x553303d460EE0afB37EdFf9bE42922D8FF63220e")
tokenAddr.set("DOT", "0x1C07AFb8E2B827c5A4739C6d59Ae3A5035f28734")
tokenAddr.set("SNX", "0xDC3EA94CD0AC27d9A86C180091e7f78C683d3699")
tokenAddr.set("YFI", "0xA027702dbb89fbd58938e4324ac03B58d812b0E1")
tokenAddr.set("BNB", "0x14e613AC84a31f709eadbdF89C6CC390fDc9540A")
tokenAddr.set("COMP", "0xdbd020CAeF83eFd542f4De03e3cF0C28A4428bd5")
tokenAddr.set("MATIC", "0x7bAC85A8a13A4BcD8abb3eB7d6b4d632c5a57676")
tokenAddr.set("1INCH", "0xc929ad75B72593967DE83E7F7Cda0493458261D9")
tokenAddr.set("BCH", "0x9F0F69428F923D6c95B781F89E165C9b2df9789D")
tokenAddr.set("MKR", "0xec1D1B3b0443256cc3860e24a46F108e699484Aa")
tokenAddr.set("SUSHI", "0xCc70F09A6CC17553b2E31954cD36E4A2d89501f7")
tokenAddr.set("XRP", "0xCed2660c6Dd1Ffd856A5A82C67f3482d88C50b12")
tokenAddr.set("FIL", "0x1A31D42149e82Eb99777f903C08A2E41A00085d3")
tokenAddr.set("GRT", "0x86cF33a451dE9dc61a2862FD94FF4ad4Bd65A5d2")
tokenAddr.set("MIR", "0x97e4f2Bc7231f2AFA05c51F524A80E1c8bF944e5")
tokenAddr.set("NMR", "0xcC445B35b3636bC7cC7051f4769D8982ED0d449A")

export const tokenAddrArr = Array.from(tokenAddr, ([key, addr]) => ({key, addr}));

export default async function priceFeed(addr) {
    const provider = new ethers.providers.JsonRpcProvider(MAINNET_API_KEY);
    const aggregatorV3InterfaceABI = [
        {
        inputs: [],
        name: "decimals",
        outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
        stateMutability: "view",
        type: "function",
        },
        {
        inputs: [],
        name: "description",
        outputs: [{ internalType: "string", name: "", type: "string" }],
        stateMutability: "view",
        type: "function",
        },
        {
        inputs: [{ internalType: "uint80", name: "_roundId", type: "uint80" }],
        name: "getRoundData",
        outputs: [
            { internalType: "uint80", name: "roundId", type: "uint80" },
            { internalType: "int256", name: "answer", type: "int256" },
            { internalType: "uint256", name: "startedAt", type: "uint256" },
            { internalType: "uint256", name: "updatedAt", type: "uint256" },
            { internalType: "uint80", name: "answeredInRound", type: "uint80" },
        ],
        stateMutability: "view",
        type: "function",
        },
        {
        inputs: [],
        name: "latestRoundData",
        outputs: [
            { internalType: "uint80", name: "roundId", type: "uint80" },
            { internalType: "int256", name: "answer", type: "int256" },
            { internalType: "uint256", name: "startedAt", type: "uint256" },
            { internalType: "uint256", name: "updatedAt", type: "uint256" },
            { internalType: "uint80", name: "answeredInRound", type: "uint80" },
        ],
        stateMutability: "view",
        type: "function",
        },
        {
        inputs: [],
        name: "version",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
        },
    ];
    const priceFeed = new ethers.Contract(addr, aggregatorV3InterfaceABI, provider);
    return priceFeed.latestRoundData();
    }
    
    export async function priceTwoDec(addr){
        const priceDec = await priceFeed(addr);
        return (ethers.BigNumber.from(priceDec.answer._hex).toNumber() / 100000000).toFixed(2).toString();
    }