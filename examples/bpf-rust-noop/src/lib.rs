//! @brief Example Rust-based BPF program that prints out the parameters passed to it

#![no_std]
#![allow(unreachable_code)]
#![allow(unused_attributes)]

#[cfg(not(test))]
extern crate solana_sdk_bpf_no_std;
extern crate solana_sdk_bpf_utils;

use solana_sdk_bpf_utils::entrypoint::*;
use solana_sdk_bpf_utils::log::*;
use solana_sdk_bpf_utils::{entrypoint, info};

struct SStruct {
    x: u64,
    y: u64,
    z: u64,
}

#[inline(never)]
fn return_sstruct() -> SStruct {
    SStruct { x: 1, y: 2, z: 3 }
}

entrypoint!(process_instruction);
fn process_instruction(ka: &mut [SolKeyedAccount], info: &SolClusterInfo, data: &[u8]) -> bool {
    info!("Program identifier:");
    sol_log_key(&info.program_id);

    // Log the provided account keys and instruction input data.  In the case of
    // the no-op program, no account keys or input data are expected but real
    // programs will have specific requirements so they can do their work.
    info!("Account keys and instruction input data:");
    sol_log_params(ka, data);

    {
        // Test - arch config
        #[cfg(not(target_arch = "bpf"))]
        panic!();
    }

    {
        // Test - use core methods, unwrap

        // valid bytes, in a stack-allocated array
        let sparkle_heart = [240, 159, 146, 150];
        let result_str = core::str::from_utf8(&sparkle_heart).unwrap();
        assert_eq!(4, result_str.len());
        assert_eq!("💖", result_str);
        info!(result_str);
    }

    {
        // Test - struct return

        let s = return_sstruct();
        assert_eq!(s.x + s.y + s.z, 6);
    }

    info!("Success");
    true
}
