import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(req: Request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'OPENAI_API_KEY sozlanmagan. apps/web/.env fayliga OPENAI_API_KEY=sk-... qo\'shing.' },
        { status: 500 },
      );
    }

    const body = await req.json();
    const {
      name = '',
      headline = '',
      location = '',
      skills = [],
      experiences = [],
      educations = [],
      projects = [],
    } = body;

    const lines: string[] = [];
    if (name) lines.push(`Ism: ${name}`);
    if (headline) lines.push(`Lavozim: ${headline}`);
    if (location) lines.push(`Joylashuv: ${location}`);
    if (skills.length) {
      const topSkills = skills.slice(0, 10).map((s: any) => s.name).join(', ');
      lines.push(`Ko'nikmalar: ${topSkills}`);
    }
    if (experiences.length) {
      const expStr = experiences
        .slice(0, 4)
        .map((e: any) => `${e.position} — ${e.company}`)
        .join('; ');
      lines.push(`Tajriba: ${expStr}`);
    }
    if (educations.length) {
      const eduStr = educations
        .slice(0, 2)
        .map((e: any) => `${e.degree} (${e.institution})`)
        .join('; ');
      lines.push(`Ta'lim: ${eduStr}`);
    }
    if (projects.length) {
      const projStr = projects.slice(0, 4).map((p: any) => p.title).join(', ');
      lines.push(`Loyihalar: ${projStr}`);
    }

    const prompt = `Siz professional portfolio muharriri siz. Quyidagi IT mutaxassisning profil ma'lumotlari asosida O'ZBEK TILIDA bio yozing.

MUHIM QOIDALAR:
- O'zbek tilida yozing (lotin yozuvida)
- Birinchi shaxs ("Men") tilida
- MAKSIMAL 380 ta belgi (bo'sh joylar bilan). Bu qoidani buzma!
- 2 ta jumla
- Emoji ishlatma
- Faqat bio textini yozing, izoh qo'shma

Profil:
${lines.join('\n')}`;


    const openai = new OpenAI({ apiKey });

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 180,
      temperature: 0.72,
    });

    let bio = completion.choices[0]?.message?.content?.trim() ?? '';
    if (bio.length > 490) {
      bio = bio.slice(0, 490).replace(/\s+\S*$/, '').trim();
      if (!bio.endsWith('.')) bio += '.';
    }
    return NextResponse.json({ bio });
  } catch (err: any) {
    const msg = err?.message || 'Bio yaratishda xato yuz berdi';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
