use crate::constant::CALC_PRECISION;
use crate::state::{User, Vault};
use anchor_lang::{prelude::*, solana_program::clock};
use std::convert::TryInto;

pub fn get_now_timestamp() -> u64 {
    return clock::Clock::get()
        .unwrap()
        .unix_timestamp
        .try_into()
        .unwrap();
}