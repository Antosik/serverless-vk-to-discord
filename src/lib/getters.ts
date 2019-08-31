import { Attachment, PhotoAttachment, VideoAttachment, VK, WallAttachment } from "vk-io";

interface IEmbed {
  title?: string;
  description?: string;
  url?: string;
  timestamp: Date;
  image?: { url?: string };
  author: { name: string, url?: string, icon_url?: string };
}

export function generateEmbed({ description, url, image, timestamp, author }: IEmbed) {
  return {
    title: "Новый пост во ВКонтакте",
    description,
    url,
    color: 14854844,
    timestamp: timestamp.toISOString(),
    thumbnail: {
      url: author.icon_url
    },
    image,
    author
  };
}

export async function getAuthor(vk: VK, ownerId: number) {
  const [data] = await vk.api.groups.getById({ group_id: String(Math.abs(ownerId)) });
  return {
    name: data.name,
    url: `https://vk.com/${data.screen_name}`,
    icon_url: data.has_photo ? data.photo_200 : ""
  };
}

export function getPhoto(attachments: Attachment[]): PhotoAttachment {
  const photos = attachments
    .filter(({ type }) => type === "photo");

  return photos.length ? photos[0] as PhotoAttachment : undefined;
}

export function getVideo(attachments: Attachment[]): VideoAttachment {
  const videos = attachments
    .filter(({ type }) => type === "video");

  return videos.length ? videos[0] as VideoAttachment : undefined;
}

export function getPreview(attachment: Attachment): string {
  if (!attachment) {
    return "";
  }

  if (attachment.type === "photo") {
    return (attachment as PhotoAttachment).largePhoto;

  } else if (attachment.type === "video") {
    const { payload } = attachment as VideoAttachment & { payload: any };
    const photos_keys = Object.keys(payload).filter((key) => key.startsWith("photo_"));
    return payload[photos_keys[photos_keys.length - 1]];
  }

  return "";
}

export function escapeSymbols(text: string): string {
  return text.replace(/([*`_~])/, "\\$1");
}

export async function regeneratePost(
  vk, {
    id, authorId, text = "",
    attachments = [],
    createdAt = Date.now() / 1000,
  }: WallAttachment & { authorId: number },
  isRepost = false
): Promise<IEmbed> {
  const post: IEmbed = {
    title: isRepost ? "Репост" : "Новый пост во ВКонтакте",
    description: "",
    url: `https://vk.com/wall${authorId}_${id}`,
    author: { name: "" },
    image: { url: "" },
    timestamp: new Date(createdAt * 1e3)
  };

  post.description = escapeSymbols(text) || "";

  const [photo, video, author] = await Promise.all([
    getPhoto(attachments),
    getVideo(attachments),
    getAuthor(vk, authorId)
  ]);
  post.author = author;

  if (photo) {
    post.image = { url: getPreview(photo) };
  } else if (video) {
    post.image = { url: getPreview(video) };
    post.description += `\n\n[Ссылка на видео](https://vk.com/video${video.ownerId}_${video.id})`;
  }

  return post;
}
