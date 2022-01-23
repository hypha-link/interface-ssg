import React, { useState } from 'react'
// import { Contract } from "ethers";
// import HyphaToken from "../../chain-info/HyphaToken.json"
// import { utils } from "ethers";
// import { useContractFunction, useContractCall } from "@usedapp/core";

// const HYPHA_ADDRESS = "0xe81FAE6d25b3f4A2bB520354F0dddF35bF77b21E";

export const Experimental = () => {
    // const [messageGuessing, setMessageGuessing] = useState(false);

    // //HyphaToken Contract
    // const abi = HyphaToken;
    // const hyphaInterface = new utils.Interface(abi);
    // const contract = new Contract(HYPHA_ADDRESS, hyphaInterface)
    // const { send: sendRandomWinner } = useContractFunction(contract, 'randomWinner');
    // const { send: sendRandomNumber } = useContractFunction(contract, 'getRandomNumber');
  
    // const winner = useContractCall({
    //   abi: hyphaInterface,
    //   address: HYPHA_ADDRESS,
    //   method: "winner"
    // })

    // From /app addMessage()
    // if(messageGuessing){
    //   //Check HyphaToken for winner
    //   if(winner){
    //     console.log("Need to reset random number")
    //     sendRandomNumber();
    //   }
    //   //Select winner if number above random is guessed
    //   else{
    //     const guess = Math.floor(Math.random() * 100)
    //     await sendRandomWinner(guess);
    //     console.log("You guessed: " + guess);
    //   }
    // }

    // const userBalance = useTokenBalance(HYPHA_ADDRESS, account);
    
    // <br></br>
    // {account !== undefined && userBalance !== undefined ? 
    // ((ethers.utils.formatUnits(userBalance, 18) + " Hypha")) : ""}
    return (
        <>
            <h2>Experimental</h2>
            {/* <button className="hypha-button" onClick={() => setMessageGuessing(!messageGuessing)}>{messageGuessing ? 
            "Participating in Message Guessing" : 
            "Not Participating in Message Guessing"}
            </button> */}
        </>
    )
}
