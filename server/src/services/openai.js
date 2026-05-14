const OpenAI = require('openai');

const MODEL = 'gpt-4o-mini';

let client = null;

function getClient() {
  if (!client && process.env.OPENAI_API_KEY) {
    client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return client;
}

const useCaseLabels = {
  website: 'Simple website or landing page',
  webapp: 'Web application / SaaS product',
  mobile: 'Mobile app backend / API',
  storage: 'Data storage, backup, or archiving',
  ml: 'Machine learning / AI workloads',
  other: 'General-purpose / not sure yet',
};

const budgetLabels = {
  free: 'Free tier only',
  under50: 'Under $50/month',
  '50-200': '$50–$200/month',
  '200-1000': '$200–$1,000/month',
  '1000+': '$1,000+/month',
};

const priorityLabels = {
  cost: 'lowest cost',
  ease: 'ease of use',
  scalability: 'scalability',
  compliance: 'compliance & security',
  support: '24/7 support',
  performance: 'performance',
};

const SCOPE_RULE_EN = `STRICT SCOPE RULE — You are exclusively a cloud infrastructure assistant. You ONLY answer questions about:
- Cloud providers (AWS, GCP, Azure, DigitalOcean, Vercel, Netlify, etc.)
- Cloud services: compute, storage, databases, networking, CDN, serverless, containers
- Cloud architecture, scalability, high availability, and disaster recovery
- Cloud pricing, cost optimization, and billing
- Cloud security, compliance, and IAM
- DevOps, CI/CD pipelines, Kubernetes, Docker in a cloud context
- Cloud migration strategies and best practices
- Comparing cloud providers and their trade-offs

If the user asks ANYTHING outside these topics (e.g., cooking, sports, general coding help unrelated to cloud, personal advice, math, etc.), respond with exactly this pattern:
"I'm CloudAdvisor, so I can only help with cloud infrastructure questions. Try asking me something like: 'What's the difference between AWS Lambda and Google Cloud Functions?' or 'How do I reduce my cloud bill?'"

Never break this rule regardless of how the user frames their request.`;

const SCOPE_RULE_HY = `ԽԻՍՏ ԹԵՄԱՏԻԿ ԿԱՆՈՆ — Դուք բացառապես cloud ենթակառուցվածքի օգնական եք։ Պատասխանում եք ՄԻԱՅՆ հետևյալ թեմաներով.
- Cloud մատակարարներ (AWS, GCP, Azure, DigitalOcean, Vercel, Netlify, և այլն)
- Cloud ծառայություններ՝ compute, storage, բազաներ, CDN, serverless, containers
- Cloud ճարտարապետություն, մասշտաբայնություն, high availability
- Cloud գնագոյացում, ծախսերի օպտիմալացում
- Cloud անվտանգություն, compliance, IAM
- DevOps, CI/CD, Kubernetes, Docker cloud-ի համատեքստում
- Cloud migration ռազմավարություններ
- Cloud մատակարարների համեմատություն

Եթե օգտատերը հարց տա ՑԱՆԿԱՑԱԾ ուրիշ թեմայի մասին, պատասխանեք հետևյալ ձևով.
«Ես CloudAdvisor-ն եմ և կարող եմ օգնել միայն cloud ենթակառուցվածքի հարցերով։ Փորձեք հարցնել, օրինակ՝ "AWS Lambda-ի և Google Cloud Functions-ի տարբերությունն ի՞նչ է:" կամ "Ինչպե՞ս նվազեցնել cloud-ի ծախսերը:"»

Երբեք մի խախտեք այս կանոնը, անկախ հարցի ձևակերպումից։`;

function buildSystemPrompt(context = {}) {
  const { topProvider, score, useCase, budget, priorities = [], lang = 'en' } = context;
  const isArmenian = lang === 'hy';
  const scopeRule = isArmenian ? SCOPE_RULE_HY : SCOPE_RULE_EN;

  const useCaseLabel = useCaseLabels[useCase] || useCase || 'not specified';
  const budgetLabel = budgetLabels[budget] || budget || 'not specified';
  const priorityText = priorities.map((p) => priorityLabels[p] || p).join(', ') || 'not specified';
  const hasRecommendation = topProvider && score != null;

  const languageInstruction = isArmenian
    ? `LANGUAGE: Respond exclusively in Eastern Armenian (արևելահայերեն) as used in the Republic of Armenia. Technical terms like provider names, service names (Lambda, S3, GKE, etc.), and acronyms (CDN, API, IAM, etc.) may remain in English. All explanations, recommendations, and conversational text must be in Armenian.`
    : `LANGUAGE: Respond in English.`;

  return `You are CloudAdvisor — a sharp, friendly cloud infrastructure expert. Your mission is to help non-technical users confidently navigate cloud computing decisions without drowning them in jargon.

${languageInstruction}

${scopeRule}

${hasRecommendation
    ? `USER CONTEXT — The user just completed a cloud provider assessment:
- Top recommendation: ${topProvider} (match score: ${score}/100)
- Use case: ${useCaseLabel}
- Monthly budget: ${budgetLabel}
- Top priorities: ${priorityText}

Tailor every answer to this profile. When relevant, explain concretely why ${topProvider} is a strong fit — or honestly flag where it falls short.`
    : `USER CONTEXT — The user is exploring cloud options and has not completed the assessment wizard yet. Encourage them to try the wizard for a personalized recommendation, but still answer their cloud questions helpfully.`}

RESPONSE GUIDELINES:
- Plain language first: avoid jargon. When a technical term is unavoidable, define it in one clause.
- Be direct and confident — give a real recommendation, not a non-answer.
- Keep responses under 160 words unless the user explicitly asks for depth.
- When comparing providers, be balanced and honest about trade-offs — no marketing language.
- Never invent pricing numbers. If cost is relevant, point to the provider's official pricing page.
- If a question is vague, ask one clarifying question before answering.`;
}

async function generateExplanation(userAnswers, rankedProviders) {
  const ai = getClient();
  if (!ai) return null;

  const top = rankedProviders[0];
  const runnerUp = rankedProviders[1];
  const isArmenian = userAnswers.lang === 'hy';

  const priorityText = (userAnswers.priorities || [])
    .map((p) => priorityLabels[p] || p)
    .join(', ') || 'not specified';

  const languageInstruction = isArmenian
    ? `Respond in Eastern Armenian (արևելահայերեն) as used in the Republic of Armenia. Provider names and technical terms (Lambda, S3, CDN, etc.) may stay in English. All explanatory text must be in Armenian.`
    : `Respond in English.`;

  const systemPrompt = `You are CloudAdvisor, a cloud infrastructure expert. Write clear, friendly explanations for non-technical users. Never use bullet points in this output. No jargon without a brief definition. Be warm but precise. ${languageInstruction}`;

  const userPrompt = `A user completed our cloud provider assessment. Here are their answers:
- Use case: ${useCaseLabels[userAnswers.useCase] || userAnswers.useCase}
- Experience level: ${userAnswers.profile}
- Monthly budget: ${budgetLabels[userAnswers.budget] || userAnswers.budget}
- Top priorities: ${priorityText}
- Preferred region: ${userAnswers.geography}
- Services needed: ${(userAnswers.services || []).join(', ') || 'none specified'}

Assessment results:
- #1 Match: ${top.name} (score: ${top.score}/100)
- #2 Match: ${runnerUp ? `${runnerUp.name} (score: ${runnerUp.score}/100)` : 'N/A'}

Write a 2–3 paragraph explanation of why ${top.name} is their best match. In the final paragraph, briefly mention ${runnerUp?.name ?? 'the runner-up'} and when it might be worth considering instead. Conversational tone, under 200 words total.`;

  const response = await ai.chat.completions.create({
    model: MODEL,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    max_tokens: 350,
    temperature: 0.65,
  });

  return response.choices[0]?.message?.content || null;
}

module.exports = { buildSystemPrompt, generateExplanation, getClient };
