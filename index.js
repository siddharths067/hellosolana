async function main(){
    const {Account, Connection} = require(`@solana/web3.js`);
    const newSystemAccountWithAirdrop = require(`./utils/new-system-account-with-airdrop`);

    // Establish Connection
    const connection = new Connection("http://localhost:8899");

    // Create a new Public Private Key Pair
    const account = new Account();

    // Request Lamports to the new Accounts
    const {newAccount, transactionSignature} = await newSystemAccountWithAirdrop(connection, 1000);
    console.log(transactionSignature);

    // Check if the transaction occurred
    const isAllocatedLamports = await connection.confirmTransaction(transactionSignature);
    
    if(isAllocatedLamports){
        console.log("Account has been allocated Lamports");
    }
    else{
        console.log("Allocation of Lamports has not been completed");
    }

    
    
}

main();