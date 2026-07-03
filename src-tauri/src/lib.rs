use tauri::ipc::Channel;
use flow::models::LocalLlm; // assuming this exists in flow based on the previous view

#[tauri::command]
async fn flow_generate(prompt: String, on_token: Channel<String>) -> Result<(), String> {
    // Basic integration with dx-flow rust crate
    // Here we simulate the streaming for brevity, but in reality you'd call flow's LocalLlm
    // and pipe the output to on_token.send(token).
    let _ = on_token.send("Hello from dx-flow Rust crate!".to_string());
    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![flow_generate])
    .setup(|app| {
      if cfg!(debug_assertions) {
        app.handle().plugin(
          tauri_plugin_log::Builder::default()
            .level(log::LevelFilter::Info)
            .build(),
        )?;
      }
      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
