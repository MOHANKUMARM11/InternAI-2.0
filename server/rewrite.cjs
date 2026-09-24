const fs = require('fs');

let c = fs.readFileSync('src/modules/ai/resume.service.js', 'utf8');
c = c.replace(/You are an expert ATS resume analyzer and career coach\.\r?\n\r?\n/, '');
c = c.replace(/process\.env\.ANTHROPIC_API_KEY/g, 'process.env.GEMINI_API_KEY');
c = c.replace('try {', "const systemInstruction = 'You are an expert ATS resume analyzer and career coach.';\n\n  try {");

fs.writeFileSync('src/modules/ai/resume.service.js', c);
