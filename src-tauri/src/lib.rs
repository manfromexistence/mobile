use tauri::ipc::Channel;
use tokio::sync::Mutex;
use flow::runtime::FlowLocalRuntime;

struct AppState {
    runtime: Mutex<Option<FlowLocalRuntime>>,
}

#[tauri::command]
async fn flow_generate(prompt: String, on_token: Channel<String>, state: tauri::State<'_, AppState>) -> Result<(), String> {
    let mut guard = state.runtime.lock().await;
    if guard.is_none() {
        *guard = Some(FlowLocalRuntime::detect().map_err(|e| e.to_string())?);
    }
    let runtime = guard.as_ref().unwrap();

    let result = runtime.generate_text(&prompt).await.map_err(|e| e.to_string())?;
    on_token.send(result).map_err(|e| e.to_string())?;
    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .manage(AppState {
            runtime: Mutex::new(None),
        })
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
