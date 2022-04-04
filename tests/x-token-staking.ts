import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { XTokenStaking } from "../target/types/x_token_staking";
import { expect } from "chai";
import { PublicKey, Keypair } from "@solana/web3.js";
import {
  createVault
} from "./fixtures/lib";

describe("x-token-staking", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.Provider.env());

  const program = anchor.workspace.XTokenStaking as Program<XTokenStaking>;

  it("xToken-Stake", async () => {
    const { vault } = await createVault(program);

    // fetch vault data
    const vaultData = await vault.fetch();

    //check the result
    expect(vaultData.rewardDuration.toNumber()).to.equal(1);
    expect(vaultData.stakeTokenCount).to.equal(500000);
    expect(vaultData.rewardMintAccount.toString()).to.equal(vault.mintAccount.toString());
    expect(vaultData.funders.length).to.equal(5);
    expect(vaultData.status.initialized !== null).to.be.true;
  });
});
