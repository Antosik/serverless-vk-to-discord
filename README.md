# serverless-vk-to-discord
## Export your community posts from VK to Discord!

## Install
1. Create [Amazon AWS](https://aws.amazon.com) account and [setup credentials](https://serverless.com/framework/docs/providers/aws/guide/credentials/)
2. Clone repository and install dependencies
```sh
$ git clone https://github.com/Antosik/serverless-vk-to-discord.git
$ npm install
```
3. Setup your credentials in `env.json` file
```js
{
  "VK_GROUP_TOKEN": "",       // Generate on https://vk.com/{short_name}?act=tokens
  "VK_GROUP_ID": "",          // Your Community ID 
  
  "VK_CALLBACK_CONFIRM": "",  // Obtainable on https://vk.com/{short_name}?act=api
  "VK_CALLBACK_SECRET": "",   // Setup on https://vk.com/{short_name}?act=api
  
  "DISCORD_WEBHOOK_URL": ""   // Obtainable on Discord server/channel settings
}
```
4. Run `deploy` command
```sh
$ serverless deploy
```
5. Setup server url on Callback API `Server settings` page and don't forget to set `Wall posts: New` on `Event types` page
6. Enjoy! :tada:


## Debug
1. Run `offline` command
```sh
$ serverless offline --printOutput
```
2. Do some requests to server (usually listening on `http://localhost:3000`)
3. :tada:

## Userful links
- [Serverless Framework](http://serverless.com)
- [Embed Visualizer](https://leovoel.github.io/embed-visualizer/)
- [Discord Developers Docs](https://discordapp.com/developers/docs/intro)
- [Discord Webhook Tutorial](https://support.discordapp.com/hc/en-us/articles/228383668-Intro-to-Webhooks)
- [VKontakte Callback API](https://vk.com/dev/callback_api)
- [vk-io](https://github.com/negezor/vk-io)



