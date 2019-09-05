async function main(){
    const {Account, Connection, BpfLoader, sendAndConfirmTransaction, SystemProgram} = require(`@solana/web3.js`);
    const newSystemAccountWithAirdrop = require(`./utils/new-system-account-with-airdrop`);
    const BufferLayout = require(`buffer-layout`);

    const fs = require(`fs`);
    const {execSync} = require(`child_process`);

    // Establish Connection
    const connection = new Connection("http://localhost:8899");

    // Create a new Public Private Key Pair
    // Request Lamports to the new Accounts
    const [account, transactionSignature] = await newSystemAccountWithAirdrop(connection, 1000000);
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
    // The reason we need to keep attempting is because Solana doesn't guarantee your program will be loaded
    // If the transaction doesn't commit and confirm after a certain timeout it won't be loaded
    var attempts = 10;
    console.log(`Attempting (max ${attempts}) to upload SO on Chain`);
    var loadedProgramId = null;
    while(attempts--){
        try{
            console.log(`Uploading BPF SO`);
            const programId = await BpfLoader.load(connection, account, elf);
            console.log(`The Program Id is : ${programId}`);
            loadedProgramId = programId;
            break;
        }
        catch (err){
            console.log(`Uploading SO failed. Retrying...... (${attempts} attempts left)`);
            console.log(`Reason for Failure ${err.message}`);
        }
    }

    if(!loadedProgramId){
        console.log(`Program was not loaded, Broski!`);
        return;
    }

    // Creating an account to associate with our Executable BPF

    const lamports = 10000;
    const fee = 100; // TODO use Fee Calculator Object to Calculate Fee


    // Bear the cost of trying to store memory
    const [programPublicKey, ppkt] = await newSystemAccountWithAirdrop(
        connection,
        lamports + fee
    );

    if(await connection.confirmTransaction(ppkt) === false){
        return;
    }
    console.log(`Did it initialize ${programPublicKey}`);
    // A Resident account to allow signing for your program
    const programAccount = new Account();

    console.log("Creating Transaction helper...");

    const transactionHelper = SystemProgram.createAccount(
        programPublicKey.publicKey,
        programAccount.publicKey,
        lamports,
        255,
        loadedProgramId
    );

    const layout = BufferLayout.struct([
        BufferLayout.u32('x'),
        BufferLayout.u32('y'),
        BufferLayout.u32('z')
    ]);
    
    const buffer = Buffer.alloc(layout.span);
    layout.encode({x:3, y:9, z:27}, buffer)
    

    console.log("Adding to helper...");
    console.log(buffer.toJSON());
    transactionHelper.add({
        keys: [
            {
                pubkey: programAccount.publicKey, 
                isSigner: true,
                isDebitable: true
            }
        ],
        programId: loadedProgramId,
        data: buffer
    });

    console.log(`Transaction Helper successfully initialized`);

    const [payerAccount, pat] = await newSystemAccountWithAirdrop(connection, 10000);

    console.log("Sending and awaiting transaction....");

    
    // Attempt mechanism is also needed here
    await sendAndConfirmTransaction(connection, transactionHelper, payerAccount, programPublicKey, programAccount);



}

main();