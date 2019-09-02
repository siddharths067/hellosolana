const {Account, Connection} = require('@solana/web3.js');

/**
 * Create a new system account and airdrop it some lamports
 *
 */
module.exports =  async function newSystemAccountWithAirdrop(
  connection,
  lamports = 1,
) {
  const account = new Account();
  const transactionSignature = await connection.requestAirdrop(account.publicKey, lamports);
  return {account, transactionSignature};
}