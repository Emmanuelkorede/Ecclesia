
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { orgName, memberName } = await req.json();
    const apiKey = Deno.env.get('GEMINI_API_KEY');

    
    const prompt = `Write a short, warm WhatsApp message (2-3 sentences max) from ${orgName} church to a member named ${memberName} who has missed the last few church services. The tone should be caring and personal, not guilt-inducing. Invite them back warmly. Do not use overly formal language. Do not include a greeting like "Dear" - start naturally like a friend would text.`;

    
const response = await fetch(
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`,
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
    }),
  }
);

    const result = await response.json();

    console.log('Gemini raw response:', JSON.stringify(result));


    
    const message = result.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

    return new Response(JSON.stringify({ message: message.trim() }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});