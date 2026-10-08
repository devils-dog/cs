const fs = require('fs')

const read = file => fs.readFileSync(file, 'utf8')
const lineupDetails = read('src/components/LineupDetails.tsx')
const videoPlayer = read('src/components/VideoPlayer.tsx')
const app = read('server/app.ts')
const telegramRoute = read('server/routes/telegram.ts')
const telegramService = read('server/services/telegram.ts')

const checks = {
  lineupDetailsUsesVideoPlayer: lineupDetails.includes('<VideoPlayer lineupId={lineup.id} />'),
  videoPlayerUsesHtml5Video: videoPlayer.includes('<video'),
  videoPlayerUsesBackendEndpoint: videoPlayer.includes('/api/telegram/lineups/'),
  appRegistersTelegramRoutes: app.includes("app.use('/api/telegram', telegramRoutes)"),
  webhookHandlesChannelPost: telegramRoute.includes('channel_post'),
  webhookStoresFileId: telegramRoute.includes('telegram_file_id'),
  serviceUsesGetFile: telegramService.includes("'getFile'"),
  serviceUsesSetWebhook: telegramService.includes("'setWebhook'")
}

for (const [name, passed] of Object.entries(checks)) console.log(`${passed ? 'PASS' : 'FAIL'}: ${name}`)
if (Object.values(checks).some(value => !value)) process.exit(1)
console.log('\nVideo flow test passed.')
