// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use reqwest::ClientBuilder;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
async fn get_api_key(hue_hub_api_url: String) -> String {
    let client = ClientBuilder::new()
        .timeout(std::time::Duration::from_secs(5))
        .danger_accept_invalid_certs(true)
        .build()
        .unwrap();

    let response = client.post(hue_hub_api_url)
        .json(&serde_json::json!({
            "devicetype": "hue_cleaner#main",
            "generateclientkey": true
        }))
        .send()
        .await;
    if let Ok(response) = response {
        let json_response = response.text().await.unwrap();
        json_response
    } else {
        "Unknown error occurred.".to_string()
    }
}

#[tauri::command]
async fn get_entertainment_areas(hue_hub_api_url: String, api_key: String) -> String {
    let client = ClientBuilder::new()
        .timeout(std::time::Duration::from_secs(5))
        .danger_accept_invalid_certs(true)
        .build()
        .unwrap();

    let response = client.get(hue_hub_api_url)
        .header("hue-application-key", api_key)
        .send()
        .await;
    if let Ok(response) = response {
        let json_response = response.text().await.unwrap();
        json_response
    } else {
        "Unknown error occurred.".to_string()
    }
}

#[tauri::command]
async fn delete_entertainment_area(hue_hub_api_url: String, api_key: String) -> String {
    let client = ClientBuilder::new()
        .timeout(std::time::Duration::from_secs(5))
        .danger_accept_invalid_certs(true)
        .build()
        .unwrap();

    let response = client.delete(hue_hub_api_url)
        .header("hue-application-key", api_key)
        .send()
        .await;
    if let Ok(response) = response {
        let json_response = response.text().await.unwrap();
        json_response
    } else {
        "Unknown error occurred.".to_string()
    }
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![get_api_key, get_entertainment_areas, delete_entertainment_area]) // Register get_api_key as an invokable handler
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
