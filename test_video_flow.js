// Test to verify the video flow implementation
const fs = require('fs');
const path = require('path');

// Verify LineupDetails uses VideoPlayer
const lineupDetailsContent = fs.readFileSync('src/components/LineupDetails.tsx', 'utf8');
const videoPlayerContent = fs.readFileSync('src/components/VideoPlayer.tsx', 'utf8');

// Check imports and usage
const hasVideoPlayerImport = lineupDetailsContent.includes('VideoPlayer') && lineupDetailsContent.includes('from \'./VideoPlayer\'');
const hasVideoPlayerUsage = lineupDetailsContent.includes('VideoPlayer') && lineupDetailsContent.includes('telegramMessageId');

console.log('LineupDetails imports VideoPlayer:', hasVideoPlayerImport);
console.log('LineupDetails uses VideoPlayer component:', hasVideoPlayerUsage);

// Check VideoPlayer implementation
const hasTelegramWebApp = videoPlayerContent.includes('getTelegramWebApp');
const hasTelegramURL = videoPlayerContent.includes('t.me/');
const hasValidProps = videoPlayerContent.includes('telegramMessageId: number');

console.log('VideoPlayer uses Telegram WebApp:', hasTelegramWebApp);
console.log('VideoPlayer constructs Telegram URL:', hasTelegramURL);
console.log('VideoPlayer has correct props:', hasValidProps);

// Check for duplicate implementations
const componentFiles = fs.readdirSync('src/components/');
const videoComponents = componentFiles.filter(file => 
  file.toLowerCase().includes('video') || 
  file.toLowerCase().includes('player')
);

console.log('Component files with video/player:', videoComponents);

// Summary
const testResult = {
  correctImplementation: hasVideoPlayerImport && hasVideoPlayerUsage && hasTelegramWebApp && hasTelegramURL && hasValidProps,
  missingComponents: videoComponents.length === 0 ? 'No additional video components found' : `Found: ${videoComponents.join(', ')}`
};

console.log('\nFinal Test Result:', testResult);

// Verify correct implementation follows the required flow:
// LineupDetails → VideoPlayer → Telegram post

const implementationCorrect = 
  hasVideoPlayerImport &&  // LineupDetails imports VideoPlayer
  hasVideoPlayerUsage &&   // LineupDetails uses VideoPlayer 
  hasTelegramWebApp &&     // VideoPlayer uses Telegram WebApp
  hasTelegramURL &&        // VideoPlayer constructs Telegram URL
  hasValidProps;           // VideoPlayer handles proper props

console.log('\nImplementation follows required flow (LineupDetails → VideoPlayer → Telegram post):', implementationCorrect);

module.exports = testResult;