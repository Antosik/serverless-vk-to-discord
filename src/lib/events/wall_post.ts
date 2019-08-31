import axios from "axios";
import { VK, WallAttachment, WallPostContext } from "vk-io";

import { regeneratePost } from "../getters";

export async function handleWallPost({ wall, vk }: WallPostContext & { wall: { authorId: number }, vk: VK }) {
  const group_id = Number(process.env.VK_GROUP_ID);
  const { authorId, copyHistory = [] } = wall;

  const embeds = [];
  if (group_id !== authorId) {
    return;
  }

  const post = await regeneratePost(vk, wall);
  embeds.push(post);

  if (copyHistory.length) {
    const repost_source = copyHistory[copyHistory.length - 1] as WallAttachment & { authorId: number } ;
    const repost = await regeneratePost(vk, repost_source, true);
    embeds.push(repost);
  }

  await callDiscordWebhook({ embeds });
}

async function callDiscordWebhook(embed) {
  await axios.post(process.env.DISCORD_WEBHOOK_URL, embed);
}
