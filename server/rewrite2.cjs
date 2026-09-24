const fs = require('fs');

let c = fs.readFileSync('src/modules/ai/resume.service.js', 'utf8');

c = c.replace(/const response = await claudeClient[\s\S]*?JSON\.parse\(jsonMatch\[0\]\)/, `const result = await generateContent(prompt, {
      systemInstruction,
      json: true,
      retries: 1
    })`);

fs.writeFileSync('src/modules/ai/resume.service.js', c);
