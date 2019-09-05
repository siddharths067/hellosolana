# Hello Solana

A scratch script which is only meant to linearly illustrate the workflow from coding to interact with the chain and deploye the compiled BPF code from RUST to the chain

# Check on Expectations

*Underlined here are the reasons I don't recommend developing a commercial application for the Solana-net yet. Launch your own Test-net if you need a BFTS for your de-centralized applications.*

- Developing for Solana is still a mess, considering its infancy, in addition to it being also subject to my level of intellect and knowledge about the chain at this stage
- From what I have seen there is a script ```do.sh``` in ```node_modules/\@solana/web3.js/examples```. It is responsible for building your project and then creating a shared object. It does so by also utilising the bpf-sdk folder in the ```web3.js``` folder. You could modify the script according to your wishes so that you don't end up building your RUST BPF project in ```node_modules```
- I don't recommend developing for the Solana Network yet, There are some couple of issues that I have yet to resolve because
    - Lamports are the on-chain currency
    - I have no deterministic way to predict the amount of lamports usage will cost in applications (I have no example to calculate fees dynamically)
    - You need to use at-least ```1000000``` lamports to load a BPF targeted shard-object
    - You also need two signers to link to a loaded BPF program along with its ID for verification of Transactions(The program account only has utility for the signing verification.). This is where the calculate fees part comes into play. Please figure it out and update this document
    - The System Program account you create needs to have some reserved memory for data earlier, So you'd have to know earlier the maximum amount of memory you would need.
    - You need to provide your System Program some lamports as well for the computation time it needs. (Citation Needed?)
    - Sending a transaction itself has some cost attached to it in terms of lamports. So you need to create a new account to send a transaction to the program

