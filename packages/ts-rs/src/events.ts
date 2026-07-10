export type TauriEvent =
  | { event: "update_available"; version: string }
  | { event: "offline_mode" };
