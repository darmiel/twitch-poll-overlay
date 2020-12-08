/* R E S O U R C E S */
import "./assets/styles/main.scss";

// get channel from url
const params: URLSearchParams = new URLSearchParams(window.location.search);
const channels: string[] = params.has("channel") ? params.getAll("channel") : [];

// warn if no channels in url params 
if (channels.length === 0) {
  console.log("[!] Warning :: No channels selected!");
}

import { Chat } from "./ts/chat";
const chat: Chat = new Chat(channels);