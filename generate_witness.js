const wc  = require("./witness_calculator.js");
const ethers = require('ethers');
const buildPoseidon = require("circomlibjs").buildPoseidon;

const { readFileSync, writeFile } = require("fs");

// for converting privkey to 4-tuple
function bigintToTuple(x) {
  // 2 ** 64
  let mod = 18446744073709551616n
  let ret = [0n, 0n, 0n, 0n];

  var x_temp = x;
  for (var idx = 0; idx < 4; idx++) {
    ret[idx] = x_temp % mod;
    x_temp = x_temp / mod;
  }
  return ret;
}



// TODO: test E2E
buildPoseidon().then(poseidon => {
  const F = poseidon.F;

  if (process.argv.length != 4) {
    console.log("Usage: node generate_witness.js <privkey> <devcon-num>");
  } else {

    const priv = process.argv[2]

    const address = ethers.utils.computeAddress(priv);
    const addressNum = BigInt(address).toString();
    const privTuple =  bigintToTuple(BigInt(priv))

    const nullifier = F.toObject(poseidon([privTuple[0]]))

    const tree_num = process.argv[3]

    const ns = new Set([1,2,3,4,5]);
    if (!ns.has(parseInt(tree_num))) {
      console.log("Must enter a num between 1 and 5, inclusive");
      return
    }

    const tree = JSON.parse(readFileSync(`./trees/tree${tree_num}.json`));
    const pathElements = tree['leafToPathElements'][addressNum];
    const pathIndices = tree['leafToPathIndices'][addressNum];
    if (pathElements === undefined || pathIndices === undefined) {
      console.log(`Your address isn't in the tree for devcon ${tree_num}`);
      return;
    }

    const input = {
      "privkey": privTuple,
      "nullifier": nullifier,
      "merkleRoot": tree['root'],
      "merklePathElements": pathElements,
      "merklePathIndices": pathIndices
    }

    const buffer = readFileSync('./VerifyCabal.wasm');
    wc(buffer).then(async witnessCalculator => {
      const buff= await witnessCalculator.calculateWTNSBin(input,0);

      // NOTE: write file to fixed place rather than arg
      writeFile('./witness.wtns', buff, function(err) {
        if (err) throw err;
      });
    });
  }
});



