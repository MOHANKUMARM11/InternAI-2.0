const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src/modules/ai/services');
const files = fs.readdirSync(dir);

files.forEach(file => {
  if (file.endsWith('.js')) {
    const fullPath = path.join(dir, file);
    let c = fs.readFileSync(fullPath, 'utf8');
    
    // Replace claudeClient with geminiClient
    c = c.replace(/import \{ claudeClient \} from '(.*)\/claudeClient\.js'/, "import { generateContent } from '$1/geminiClient.js'");
    
    // Replace ANTHROPIC_API_KEY with GEMINI_API_KEY
    c = c.replace(/ANTHROPIC_API_KEY/g, 'GEMINI_API_KEY');

    // For prompt string, remove the system instruction part and move to a variable if needed
    // Actually, in the prompt, let's just use it as the user prompt. 
    
    // Replace claude call with gemini call
    c = c.replace(/const response = await claudeClient\.messages\.create\(\{\s*model: [^,]+,\s*max_tokens: \d+,\s*messages: \[\{ role: 'user', content: prompt \}\]\s*\}\)/g, 
      "const parsed = await generateContent(prompt, { json: true, retries: 1 })");
      
    // Remove manual parsing
    c = c.replace(/const raw = response\.content\[0\]\.text[\s\S]*?const parsed = JSON\.parse\(jsonMatch\[0\]\)/g, '');

    fs.writeFileSync(fullPath, c);
  }
});
console.log('Done refactoring M8-M12 backend services.');
