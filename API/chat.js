const SYSTEM =
  "You are a friendly, knowledgeable AI tutor. Answer any question related to AI, machine learning, " +
  "AI tools, prompting, or how to build things with AI (including how to build an AI chatbot, an AI app, " +
  "or use an AI API), using your own knowledge. Explain things in simple, clear language suitable for a " +
  "college student, with practical steps when the question asks how to build or do something. " +
  "Always reply in the same language the user asked in. If they write in Telugu, reply in Telugu " +
  "(Telugu script). If they write in English, reply in English. If they mix languages, match their mix. " +
  "Keep answers under 200 words unless the question clearly needs more detail. " +
  "If a question is completely unrelated to AI, technology or learning, politely steer back to AI topics.";

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Use POST.' });
  }
  try {
    let body = req.body;
    if (typeof body === 'string') body = JSON.parse(body);
    let msgs = Array.isArray(body && body.messages) ? body.messages : [];
    msgs = msgs
      .filter(function (m) {
        return m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string' && m.content.trim();
      })
      .slice(-10)
      .map(function (m) {
        return { role: m.role, content: m.content.slice(0, 2000) };
      });
    while (msgs.length && msgs[0].role !== 'user') msgs.shift();
    if (!msgs.length || msgs[msgs.length - 1].role !== 'user') {
      return res.status(400).json({ error: 'Please send a question.' });
    }

    let reply = '';

    if (process.env.ANTHROPIC_API_KEY) {
      const r = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-api-key': process.env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: process.env.ANTHROPIC_MODEL || 'claude-haiku-4-5-20251001',
          max_tokens: 700,
          system: SYSTEM,
          messages: msgs
        })
      });
      const data = await r.json();
      if (!r.ok) throw new Error('provider');
      reply = (data.content || []).filter(function (b) { return b.type === 'text'; }).map(function (b) { return b.text; }).join('\n');
    } else if (process.env.GEMINI_API_KEY) {
      const model = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
      const r = await fetch(
        'https://generativelanguage.googleapis.com/v1beta/models/' + model + ':generateContent?key=' + process.env.GEMINI_API_KEY,
        {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: SYSTEM }] },
            contents: msgs.map(function (m) {
              return {
                role: m.role === 'assistant' ? 'model' : 'user',
                parts: [{ text: m.content }]
              };
            }),
            generationConfig: { maxOutputTokens: 700 }
          })
        }
      );
      const data = await r.json();
      if (!r.ok) throw new Error('provider');
      const parts = data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts;
      reply = (parts || []).map(function (p) { return p.text || ''; }).join('\n');
    } else {
      return res.status(503).json({ error: 'Chatbot is not set up yet. Add an API key in the Vercel settings.' });
    }

    if (!reply.trim()) throw new Error('empty');
    return res.status(200).json({ reply: reply.trim() });
  } catch (e) {
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
};