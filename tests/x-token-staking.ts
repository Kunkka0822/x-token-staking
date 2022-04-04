import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { XTokenStaking } from "../target/types/x_token_staking";

describe("x-token-staking", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.Provider.env());

  const program = anchor.workspace.XTokenStaking as Program<XTokenStaking>;

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.rpc.initialize({});
    console.log("Your transaction signature", tx);
  });
});
