import cron from 'node-cron'
import { generateWeeklyPrompts } from '../modules/progress/progress.service.js'

export const startProgressSync = () => {
  // Run every Sunday at midnight
  cron.schedule('0 0 * * 0', async () => {
    console.log('Progress sync started')
    try {
      await generateWeeklyPrompts()
    } catch (err) {
      console.error('Progress sync failed', err)
    }
  })
}
