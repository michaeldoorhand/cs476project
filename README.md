
Problem:
  Error: error:0308010C:digital envelope routines::unsupported
Fix:
  set NODE_OPTIONS=--openssl-legacy-provider

My smart contracts can be found in the contracts folder. 'SocialNetwork.sol' is what I currently have my smartt contract
code in.  I've left in some of the naming from the tutorial I followed so
it is still named socialNetwork for the time being.To test my smart contract run truffle test in the console. Ive added an addDemographic smart contract that
adds a demographic row of data onto the chain.. Now that I have a good understanding of how these files interact with each other
Im going to start work on adding more to my smart contracts to ensure the data is encrypted and created more test
cases to thoroughly test my changes. 
