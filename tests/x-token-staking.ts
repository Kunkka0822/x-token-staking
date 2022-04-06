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

  xit("xToken-Stake", async () => {
    const { vault } = await createVault(program);

    // fetch vault data
    const vaultData = await vault.fetch();

    // check the result
    expect(vaultData.rewardDuration.toNumber()).to.equal(1);
    expect(vaultData.stakeTokenCount).to.equal(500000);
    expect(vaultData.rewardMintAccount.toString()).to.equal(vault.mintAccount.toString());
    expect(vaultData.funders.length).to.equal(5);
    expect(vaultData.status.initialized !== null).to.be.true;
  });

  xit("Authorize and Unauthorized Funder", async () => {
    const { authority, vault } = await createVault(program);

    // add funer
    const { funderAdded } = await vault.addFunder(authority);

    // fetch vault data
    let vaultData = await vault.fetch();

    // check added funder
    expect(vaultData.funders[0].toString()).to.equal(
      funderAdded.publicKey.toString()
    );

    // remove funder
    await vault.removeFunder(authority, funderAdded.publicKey);

    // fetch vault data
    vaultData = await vault.fetch();

    // check removed funder
    expect(vaultData.funders[0].toString()).to.equal(
      PublicKey.default.toString()
    );
  });

  xit("Fund Amount", async () => {
    const { mint, authority, vault } = await createVault(program);

    // add funder
    const { funderAdded } = await vault.addFunder(authority);
    const funderTokenAccount = await mint.createAssociatedAccount(
      funderAdded.publicKey
    );

    const amount = new anchor.BN("1000000");
    await mint.mintTokens(funderTokenAccount, amount.toNumber());

    // fund
    await vault.fund({
      authority,
      funder: funderAdded,
      funderAccount: funderTokenAccount.key,
      amount: new anchor.BN("1000000"),
    });

    let vaultData = await vault.fetch();

    const rightSide = "1".padEnd(66, "0");
    expect(vaultData.rewardRate.toString()).to.equal(
      new anchor.BN(rightSide, 2).toString()
    );
  });

  xit("Create User", async () => {
    const { vault } = await createVault(program);

    // create user
    const { authority: userAuthority, user } = await vault.createUser();
  })
});
