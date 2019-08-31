import axios from "axios";
import { VK, WallPostContext } from "vk-io";

import { generateEmbed, getAuthor, getPhoto } from "../getters";

export async function handleWallPost({ wall, vk }: WallPostContext & { wall: { authorId: number }, vk: VK }) {
  const group_id = Number(process.env.VK_GROUP_ID);
  const {
    authorId,
    id,
    text = "v",
    attachments = [],
    createdAt = Date.now() / 1000,
    copyHistory = []
  } = wall;

  if (group_id !== authorId || copyHistory.length) {
    return;
  }

  const [image, author] = await Promise.all([
    getPhoto(attachments),
    getAuthor(vk, group_id)
  ]);

  const embed = generateEmbed({
    description: text || "v",
    url: `https://vk.com/wall${group_id}_${id}`,
    timestamp: new Date(createdAt * 1e3),
    image,
    author
  });

  await callDiscordWebhook(embed);
}

async function callDiscordWebhook(embed) {
  await axios.post(process.env.DISCORD_WEBHOOK_URL, embed);
}
