export type TauriCommand =
  | { cmd: "send_message"; text: string }
  | { cmd: "get_api_key"; key: string }
  | { cmd: "authenticate" };
