mod constant;
mod instructions;
mod state;

use anchor_lang::prelude::*;
use instructions::*;

declare_id!("FybAozi3mWJ95a87f8ihBNNbWCkR1mv64S6gJH8cDDhJ");

#[program]
pub mod x_token_staking {
    use super::*;

    pub fn create_vault(
        ctx: Context<CreateVault>,
        reward_bump: u8,
        reward_duration: u64,
        stake_token_count: u32,
    ) -> ProgramResult {
        create_vault::create_vault(ctx, reward_bump, reward_duration, stake_token_count)
    }
}
