import * as anchor from "@project-serum/anchor";
import { XTokenStaking } from "../../target/types/x_token_staking";
import {
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import {
  PublicKey,
  Keypair,
  TransactionSignature,
  SYSVAR_RENT_PUBKEY,
  SystemProgram,
} from "@solana/web3.js";
import { Mint } from "./mint";
import { getRewardAddress, /*getUserAddress,*/ spawnMoney } from "./lib";
//import { TokenAccount } from "./token-account";

const VAULT_STAKE_SEED = "x_token_vault_stake";

export class Vault {
    constructor(
        public program: anchor.Program<XTokenStaking>,
        public key: PublicKey,
        public mint: Mint,
        public mintAccount: PublicKey,
        public mintCount: number,
        public rewardDuration: number
    ) {}

    async fetch(): Promise<VaultData | null> {
        return (await this.program.account.vault.fetchNullable(
            this.key
        )) as VaultData | null;
    }

    static async create({
        authority = Keypair.generate(),
        vaultKey = Keypair.generate(),
        program,
        mint,
        duration,
        stakeTokenCount,
    }: {
        authority?: Keypair;
        vaultKey?: Keypair;
        program: anchor.Program<XTokenStaking>;
        mint: Mint;
        duration: number;
        stakeTokenCount: number;
    }): Promise<{
        authority: Keypair;
        vault: Vault;
        sig: TransactionSignature;
    }> {
        await spawnMoney(program, authority.publicKey, 10);

        const [reward, rewardBump] = await getRewardAddress(
            vaultKey.publicKey,
            program
        );

        const mintAccount = await mint.getAssociatedTokenAddress(reward);

        const txSignature = await program.rpc.createVault(
            rewardBump,
            new anchor.BN(duration),
            stakeTokenCount,
            {
                accounts: {
                    authority: authority.publicKey,
                    vault: vaultKey.publicKey,
                    reward,
                    rewardMint: mint.key,
                    rewardAccount: mintAccount,
                    rent: SYSVAR_RENT_PUBKEY,
                    tokenProgram: TOKEN_PROGRAM_ID,
                    associatedToken: ASSOCIATED_TOKEN_PROGRAM_ID,
                    systemProgram: SystemProgram.programId,
                },
                signers: [authority, vaultKey],
                options: {
                    commitment: "confirmed",
                },
            }
        );
        return {
            authority,
            vault: new Vault(
                program,
                vaultKey.publicKey,
                mint,
                mintAccount,
                stakeTokenCount,
                duration
            ),
            sig: txSignature
        };
    }
}

export type VaultStatus = {
    none?: {};
    initialized?: {};
    paused?: {};
};

export type VaultData = {
    authority: PublicKey;
    status: VaultStatus;
    rewardMint: PublicKey;
    rewardBump: number;
    rewardMintAccount: PublicKey;
    rewardDuration: anchor.BN;
    rewardDurationDeadline: anchor.BN;
    rewardRate: anchor.BN;
    stakedCount: number;
    stakeTokenCount: number;
    userCount: number;
    funders: PublicKey[];
};