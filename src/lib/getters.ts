import { Attachment, PhotoAttachment, VideoAttachment, VK } from "vk-io";

interface IEmbed {
  title?: string;
  description?: string;
  url?: string;
  timestamp: Date;
  image?: { url?: string };
  video?: { url?: string };
  author: { name: string, url?: string, icon_url?: string };
}

export function generateEmbed({ description, url, image, timestamp, author }: IEmbed) {
  return {
    embeds: [
      {
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
      }
    ]
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

export function getPhoto(attachments: Attachment[]) {
  const photos = attachments
    .filter(({ type }) => type === "photo")
    .map(({ largePhoto }: PhotoAttachment) => largePhoto);
  const videos = attachments
    .filter(({ type }) => type === "video")
    .map(({ payload }: VideoAttachment & { payload: any }) => payload.photo_640);

  if (photos.length) {
    return { url: photos[0] };
  } else if (videos.length) {
    return { url: videos[0] };
  } else {
    return {};
  }
}
