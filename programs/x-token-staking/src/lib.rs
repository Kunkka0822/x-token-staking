use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod x_token_staking {
    use super::*;

    pub fn create_vault(
        ctx: Context<CreateVault>,
        reward_bump: u8,
        reward_duration: u64,
        stake_token_count: u32,
    ) -> Result<()> {
        create_vault::create_vault(ctx, reward_bump, reward_duration, stake_token_count)
    }
}
