async function main(){
    const {Account, Connection, BpfLoader} = require(`@solana/web3.js`);
    const newSystemAccountWithAirdrop = require(`./utils/new-system-account-with-airdrop`);

    const fs = require(`fs`);
    const {execSync} = require(`child_process`);

    // Establish Connection
    const connection = new Connection("http://localhost:8899");

    // Create a new Public Private Key Pair
    // Request Lamports to the new Accounts
    const {account, transactionSignature} = await newSystemAccountWithAirdrop(connection, 1000000);
    console.log(transactionSignature);

    // Check if the transaction occurred
    const isAllocatedLamports = await connection.confirmTransaction(transactionSignature);
    
    // Printing Transaction Status
    if(isAllocatedLamports){
        console.log("Account has been allocated Lamports");
    }
    else{
        console.log("Allocation of Lamports has not been completed");
    }

    const accountInformation = await connection.getAccountInfo(account.publicKey);
    console.log(accountInformation);

    // Running Compilation command
    console.log(`Compiling Project`)
    const compilationResult = execSync(`./node_modules/\@solana/web3.js/examples/bpf-rust-noop/do.sh build solana-bpf-rust-noop`);
    console.log(compilationResult.toString(`utf-8`));

    // Loading BPF Code
    console.log("Reading Shared Object File");
    const elf = fs.readFileSync("./node_modules/\@solana/web3.js/examples/bpf-rust-noop/target/bpfel-unknown-unknown/release/solana_bpf_rust_noop.so");
    //console.log(elf);
    console.log("SO Reading Completed");

    // Uploading BPF SO
    var attempts = 10;
    console.log(`Attempting (max ${attempts}) to upload SO on Chain`);
    while(attempts--){
        try{
            console.log(`Uploading BPF SO`);
            const programId = await BpfLoader.load(connection, account, elf);
            console.log(`The Program Id is : ${programId}`);
            break;
        }
        catch (err){
            console.log(`Uploading SO failed. Retrying...... (${attempts} attempts left)`);
            console.log(`Reason for Failure ${err.message}`);
        }
    }
}

main();