import cron from 'node-cron'
import axios from 'axios'
import { MarketData } from '../modules/market/market.model.js'

const domains = ['Frontend Developer', 'Backend Developer', 'Data Science', 'Machine Learning', 'DevOps']

const COMMON_SKILLS = [
  'React', 'Node.js', 'Python', 'Docker', 'AWS', 'JavaScript', 'TypeScript', 'MongoDB', 
  'SQL', 'Java', 'C++', 'Go', 'Kubernetes', 'TensorFlow', 'PyTorch', 'Git', 'Linux', 
  'Azure', 'GCP', 'PostgreSQL', 'Redis', 'GraphQL', 'REST', 'Vue', 'Angular', 'Django', 
  'Flask', 'Spring Boot', 'Ruby on Rails', 'PHP', 'Laravel', 'C#', '.NET', 'Swift', 'Kotlin', 
  'Flutter', 'React Native', 'Data Analysis', 'Machine Learning', 'Deep Learning', 'NLP', 
  'Computer Vision', 'Data Engineering', 'Big Data', 'Spark', 'Hadoop', 'Kafka', 'Elasticsearch'
]

export const startMarketSync = () => {
  cron.schedule('0 2 * * *', async () => {   // Runs at 2am daily
    console.log('Market data sync started')

    for (const domain of domains) {
      try {
        let skills = [];
        let totalJobs = 0;
        
        if (!process.env.JSEARCH_API_KEY || process.env.JSEARCH_API_KEY === 'dummy_key_for_testing') {
           console.log(`Mocking Market Sync for ${domain}`)
           totalJobs = Math.floor(Math.random() * 500) + 100;
           
           const mockSkills = [...COMMON_SKILLS].sort(() => 0.5 - Math.random()).slice(0, 15);
           skills = mockSkills.map(s => ({
              skill: s,
              count: Math.floor(Math.random() * 200) + 10,
              change: Math.floor(Math.random() * 20) - 10
           })).sort((a,b) => b.count - a.count);
        } else {
           const { data } = await axios.get('https://jsearch.p.rapidapi.com/search', {
             params: { query: `${domain} internship India`, num_pages: 1 },
             headers: {
               'X-RapidAPI-Key': process.env.JSEARCH_API_KEY,
               'X-RapidAPI-Host': process.env.JSEARCH_API_HOST || 'jsearch.p.rapidapi.com'
             }
           })

           const jobs = data.data || []
           const skillFreq = {}

           jobs.forEach(job => {
             const desc = (job.job_description || '').toLowerCase()
             COMMON_SKILLS.forEach(skill => {
               if (desc.includes(skill.toLowerCase())) {
                 skillFreq[skill] = (skillFreq[skill] || 0) + 1
               }
             })
           })

           skills = Object.entries(skillFreq)
             .sort((a, b) => b[1] - a[1])
             .slice(0, 15)
             .map(([skill, count]) => ({ skill, count, change: 0 }))
           
           totalJobs = jobs.length;
        }

        await MarketData.create({ 
           domain, 
           location: 'India', 
           skills, 
           totalJobs: totalJobs, 
           fetchedAt: new Date() 
        })

      } catch (err) {
        console.error(`Market sync failed for ${domain}:`, err.message)
      }
    }
  })
}
