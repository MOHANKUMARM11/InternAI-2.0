import { MarketData } from './market.model.js'

export const getPulse = async () => {
  const domains = ['Frontend Developer', 'Backend Developer', 'Data Science', 'Machine Learning', 'DevOps']
  const latestData = {}

  for (const domain of domains) {
    const data = await MarketData.findOne({ domain }).sort({ fetchedAt: -1 })
    if (data) {
      latestData[domain] = data
    }
  }

  return latestData
}

export const getTrending = async () => {
  // Aggregate all skills across domains from the most recent fetches
  // Here we just fetch the top skills that have a positive change across the latest documents
  
  const recentData = await MarketData.find().sort({ fetchedAt: -1 }).limit(10)
  
  const skillMap = {}
  
  recentData.forEach(doc => {
     doc.skills.forEach(s => {
        if (!skillMap[s.skill]) {
           skillMap[s.skill] = { skill: s.skill, change: 0, count: 0 }
        }
        skillMap[s.skill].change += (s.change || 0)
        skillMap[s.skill].count += (s.count || 0)
     })
  })
  
  const trending = Object.values(skillMap)
     .sort((a,b) => b.change - a.change)
     .slice(0, 10)
     
  return trending
}
