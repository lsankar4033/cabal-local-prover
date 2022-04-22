# cabal-local-prover

Generate proofs for cabal locally.

### Setup

```
$ yarn
$ npm install -g snarkjs
```

### Proving

First, disconnect your internet! You'll be running a CLI command with your private key as raw input, so make sure you're not online.

Next, read the code. To audit that your private key isn't stored anywhere and that the proof returned is the output from snarkjs (and not some artifact that in any way can be used to reconstruct your private key).

Next, generate your witness:

```
$ node generate_witness.js <privkey> <devcon-num>
```

For example, if you're generating a proof for private key `0xDEADBEEF` and DevCon4:

```
$ node generate_witness.js "0xDEAFBEEF" 4
```

This command outputs the witness locally to witness.wtns.

Finally, generate your proof:

```
snarkjs g16p VerifyCabal.zkey witness.wtns proof.json public.json
```

This will generate `proof.json` and `public.json`. The json you'll need to enter into the cabal UI is a concatenation of these, of the format

```
{
    "proof": (proof.json),
    "publicSignals": (public.json object)
}
```

Welcome to the cabal.
