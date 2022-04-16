# cabal-local-prover

TODO: flesh the below out more

Instructions:
- (read code? verify that zkey, wasm file are same as hosted versions?)
- disconnect from internet
- yarn
- npm install -g snarkjs
- `node generate_witness.js privkey devcon-num`
- `snarkjs g16p prove VerifyCabal.zkey witness.wtns proof.json public.json`
- reconnect to internet, paste proof.json, public.json into site, submit
