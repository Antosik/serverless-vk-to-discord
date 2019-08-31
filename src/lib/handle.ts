import { VK } from "vk-io";
import { handleWallPost } from "./events/wall_post";

export async function handleVK(body) {
  const vk = new VK({
    token: process.env.VK_GROUP_TOKEN,
    language: "ru",
    webhookConfirmation: process.env.VK_CALLBACK_CONFIRM,
    webhookSecret: process.env.VK_CALLBACK_SECRET
  });

  vk.updates.on("new_wall_post", handleWallPost);
  return await vk.updates.handleWebhookUpdate(body);
}
