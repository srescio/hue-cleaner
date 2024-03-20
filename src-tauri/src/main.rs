// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use reqwest::StatusCode;
use reqwest::ClientBuilder;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
async fn check_hue_hub_connection(hue_hub_debug_url: String) -> bool {
    let client = ClientBuilder::new()
        .timeout(std::time::Duration::from_secs(5))
        .danger_accept_invalid_certs(true)
        .build()
        .unwrap();

    let response = client.get(hue_hub_debug_url).send().await;
    if let Ok(response) = response {
        response.status() == StatusCode::OK
    } else {
        false
    }
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![check_hue_hub_connection])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
