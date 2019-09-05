# Hello Solana

A scratch script which is only meant to linearly illustrate the workflow from coding to interact with the chain and deploye the compiled BPF code from RUST to the chain

# Check on Expectations

- Developing for Solana is still a mess, considering its infancy, in addition to it being also subject to my level of intellect and knowledge about the chain at this stage
- From what I have seen there is a script ```do.sh``` in ```node_modules/\@solana/web3.js/examples```. It is responsible for building your project and then creating a shared object. It does so by also utilising the bpf-sdk folder in the ```web3.js``` folder. You could modify the script according to your wishes so that you don't end up building your RUST BPF project in ```node_modules```
- I don't recommend developing for the Solana Network yet, There are some couple of issues that I have yet to resolve