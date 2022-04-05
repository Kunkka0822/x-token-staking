import * as anchor from "@project-serum/anchor";
import { Mint } from "./mint";
import { XTokenStaking } from "../../target/types/x_token_staking";

export class TokenAccount<
    T extends anchor.web3.PublicKey | anchor.web3.Keypair
> {
    constructor(
        public program: anchor.Program<XTokenStaking>,
        public key: anchor.web3.publicKey,
        public mint: Mint,
        public owner: T
    ) {}
}
