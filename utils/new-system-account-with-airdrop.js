const {Account, Connection} = require('@solana/web3.js');

/**
 * Create a new system account and airdrop it some lamports
 *
 */
module.exports =  async function newSystemAccountWithAirdrop(
  connection,
  lamports = 1,
) {
  const newAccount = new Account();
  const transactionSignature = await connection.requestAirdrop(newAccount.publicKey, lamports);
  return {newAccount, transactionSignature};
}