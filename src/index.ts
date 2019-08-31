import { handleVK } from "./lib/handle";
import { getEventBody, isEnvValid } from "./lib/validate";

export async function handle(event) {
  if (!isEnvValid) {
    console.error("Please, specify all environment variables!");
    return {
      statusCode: 200,
      body: "ok"
    };
  }

  const body = getEventBody(event);
  if (!body) {
    return {
      statusCode: 200,
      body: "ok"
    };
  }

  try {
    if (body.type === "confirmation") {
      return {
        statusCode: 200,
        body: process.env.VK_CALLBACK_CONFIRM
      };
    }

    await handleVK(body);

    return {
      statusCode: 200,
      body: "ok",
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: "error",
    };
  }
}
