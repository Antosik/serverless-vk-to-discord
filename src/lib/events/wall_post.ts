import axios from "axios";
import { VK, WallPostContext } from "vk-io";

import { generateEmbed, getAuthor, getPhoto, getPreview, getVideo } from "../getters";

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

  const [photo, video, author] = await Promise.all([
    getPhoto(attachments),
    getVideo(attachments),
    getAuthor(vk, group_id)
  ]);

  let description = text || "";

  let image = {};
  if (photo) {
    image = { url: getPreview(photo) };
  } else if (video) {
    image = { url: getPreview(video) };
    description += `\n\n[Ссылка на видео](https://vk.com/video${video.ownerId}_${video.id})`;
  }

  const embed = generateEmbed({
    description: description || "v",
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
