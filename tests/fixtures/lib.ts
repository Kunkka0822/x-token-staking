import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { XTokenStaking } from "../../target/types/x_token_staking";
import { Mint } from "./mint";
import { Vault } from "./vault";
import { Keypair, PublicKey } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";

const VAULT_REWARD_SEED = "x_token_vault_reward";
const VAULT_USER_SEED = "x_token_vault_user";

async function createVault(program: Program<XTokenStaking>): Promise<{
    mint: Mint;
    authority: Keypair;
    vault: Vault;
}> {
    // create reward token
    const mint = await Mint.create(program);

    // create vault
    const { authority, vault } = await Vault.create({
         program,
         mint,
         duration: 1,
         stakeTokenCount: 500000,
    });

    return {
        mint,
        authority,
        vault,
    };
}

function toPublicKey<T extends PublicKey | Keypair>(val: T): PublicKey {
    if ("publicKey" in val) {
        return val.publicKey;
    }
    return val;
}

async function getRewardAddress(
    source: PublicKey,
    program: Program<XTokenStaking>
): Promise<[PublicKey, number]> {
    return await PublicKey.findProgramAddress(
        [Buffer.from(VAULT_REWARD_SEED), source.toBuffer()],
        program.programId
    );
}

async function getUserAddress(
    vault: PublicKey,
    authority: PublicKey,
    program: Program<XTokenStaking>
): Promise<[PublicKey, number]> {
    return await PublicKey.findProgramAddress(
        [Buffer.from(VAULT_USER_SEED), vault.toBuffer(), authority.toBuffer()],
        program.programId
    );
}

async function spawnMoney(
    program: anchor.Program<XTokenStaking>,
    to: PublicKey,
    sol: number,
): Promise<anchor.web3.TransactionSignature> {
    const lamports = sol * anchor.web3.LAMPORTS_PER_SOL;
    const transaction = new anchor.web3.Transaction();
    transaction.add(
        anchor.web3.SystemProgram.transfer({
            fromPubkey: program.provider.wallet.publicKey,
            lamports,
            toPubkey: to,
        })
    );
    return await program.provider.send(transaction, [], {
        commitment: "confirmed",
    });
}

export {
    createVault,
    toPublicKey,
    spawnMoney,
    getRewardAddress,
    getUserAddress
};