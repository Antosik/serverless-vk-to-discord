export function getEventBody(event) {
  const group_id = Number(process.env.VK_GROUP_ID);
  const group_id_abs = Math.abs(group_id);

  if (!event.body) {
    return undefined;
  }

  try {
    const body = JSON.parse(event.body);
    if (
      !body || !body.type ||
      body.secret !== process.env.VK_CALLBACK_SECRET ||
      body.group_id !== group_id_abs
    ) {
      return undefined;
    }

    return body;
  } catch (error) {
    return undefined;
  }
}

export function isEnvValid() {
  return !process.env.VK_GROUP_TOKEN ||
    !process.env.VK_GROUP_ID ||
    !process.env.VK_CALLBACK_CONFIRM ||
    !process.env.VK_CALLBACK_SECRET ||
    !process.env.DISCORD_WEBHOOK_URL;
}
