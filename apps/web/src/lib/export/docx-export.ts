import {
  Document, Packer, Paragraph, TextRun, HeadingLevel,
  AlignmentType, BorderStyle, Table, TableRow, TableCell,
  WidthType, ShadingType, UnderlineType,
} from 'docx';
import { saveAs } from 'file-saver';
import type { ExportProfile } from './pdf-templates';

const LEVEL_LABELS: Record<string, string> = {
  BEGINNER: 'Beginner', INTERMEDIATE: 'Intermediate', ADVANCED: 'Advanced', EXPERT: 'Expert',
};

const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });

function heading1(text: string): Paragraph {
  return new Paragraph({
    children: [new TextRun({ text, bold: true, size: 36, color: '1e3a5f' })],
    spacing: { before: 0, after: 80 },
  });
}

function heading2(text: string): Paragraph {
  return new Paragraph({
    children: [new TextRun({ text: text.toUpperCase(), bold: true, size: 20, color: '1e40af' })],
    border: {
      bottom: { color: 'bfdbfe', size: 6, style: BorderStyle.SINGLE },
    },
    spacing: { before: 280, after: 100 },
  });
}

function subheading(text: string, right?: string): Paragraph {
  const children: TextRun[] = [new TextRun({ text, bold: true, size: 22 })];
  if (right) {
    children.push(new TextRun({ text: `\t${right}`, size: 18, color: '64748b' }));
  }
  return new Paragraph({
    children,
    tabStops: [{ type: 'right', position: 9360 }],
    spacing: { before: 120, after: 40 },
  });
}

function body(text: string, color = '475569'): Paragraph {
  return new Paragraph({
    children: [new TextRun({ text, size: 18, color })],
    spacing: { before: 0, after: 60 },
  });
}

function tags(techs: string[]): Paragraph {
  return new Paragraph({
    children: techs.slice(0, 8).map((t, i) => new TextRun({
      text: t + (i < techs.length - 1 && i < 7 ? '  ·  ' : ''),
      size: 16, color: '1e40af',
    })),
    spacing: { before: 40, after: 80 },
  });
}

function emptyLine(): Paragraph {
  return new Paragraph({ children: [new TextRun('')], spacing: { before: 0, after: 80 } });
}

export async function downloadDocx(profile: ExportProfile): Promise<void> {
  const paragraphs: Paragraph[] = [];

  // Title block
  paragraphs.push(heading1(profile.name || profile.username));

  if (profile.headline) {
    paragraphs.push(new Paragraph({
      children: [new TextRun({ text: profile.headline, size: 24, color: '64748b', italics: true })],
      spacing: { before: 0, after: 80 },
    }));
  }

  if (profile.isOpenToWork) {
    paragraphs.push(new Paragraph({
      children: [new TextRun({ text: '● Open to Work', size: 18, color: '059669', bold: true })],
      spacing: { before: 0, after: 80 },
    }));
  }

  // Contact
  const contacts: string[] = [];
  if (profile.location) contacts.push(`Location: ${profile.location}`);
  if (profile.github) contacts.push(`GitHub: ${profile.github}`);
  if (profile.linkedin) contacts.push(`LinkedIn: ${profile.linkedin}`);
  if (profile.website) contacts.push(`Website: ${profile.website}`);
  if (profile.phone) contacts.push(`Phone: ${profile.phone}`);
  if (contacts.length > 0) {
    paragraphs.push(new Paragraph({
      children: contacts.map((c, i) => new TextRun({
        text: c + (i < contacts.length - 1 ? '   |   ' : ''),
        size: 17, color: '64748b',
      })),
      spacing: { before: 40, after: 160 },
    }));
  }

  // Bio
  if (profile.bio) {
    paragraphs.push(heading2('About'));
    paragraphs.push(new Paragraph({
      children: [new TextRun({ text: profile.bio, size: 18, color: '374151' })],
      spacing: { before: 0, after: 80 },
    }));
  }

  // Experience
  if (profile.experiences.length > 0) {
    paragraphs.push(heading2('Work Experience'));
    for (const exp of profile.experiences) {
      const dateStr = `${fmtDate(exp.startDate)} — ${exp.isCurrent ? 'Present' : exp.endDate ? fmtDate(exp.endDate) : ''}`;
      paragraphs.push(subheading(exp.company, dateStr));
      paragraphs.push(new Paragraph({
        children: [new TextRun({ text: exp.position, size: 20, bold: true, color: '374151' })],
        spacing: { before: 0, after: 40 },
      }));
      if (exp.location) paragraphs.push(body(exp.location, '9ca3af'));
      if (exp.description) paragraphs.push(body(exp.description));
      paragraphs.push(emptyLine());
    }
  }

  // Projects
  if (profile.projects.length > 0) {
    paragraphs.push(heading2('Projects'));
    for (const p of profile.projects) {
      paragraphs.push(new Paragraph({
        children: [
          new TextRun({ text: p.title, bold: true, size: 22 }),
          ...(p.featured ? [new TextRun({ text: '  ★ Featured', size: 16, color: 'd97706' })] : []),
        ],
        spacing: { before: 120, after: 40 },
      }));
      paragraphs.push(body(p.description));
      if (p.techs.length > 0) paragraphs.push(tags(p.techs));
      const links: string[] = [];
      if (p.github) links.push(`GitHub: ${p.github}`);
      if (p.demo) links.push(`Demo: ${p.demo}`);
      if (links.length > 0) paragraphs.push(body(links.join('   |   '), '1d4ed8'));
      paragraphs.push(emptyLine());
    }
  }

  // Skills
  if (profile.skills.length > 0) {
    paragraphs.push(heading2('Skills'));
    const byCat = profile.skills.reduce((a, s) => {
      const k = s.category || 'General';
      (a[k] = a[k] || []).push(s);
      return a;
    }, {} as Record<string, typeof profile.skills>);
    for (const [cat, items] of Object.entries(byCat)) {
      if (Object.keys(byCat).length > 1) {
        paragraphs.push(new Paragraph({
          children: [new TextRun({ text: cat, bold: true, size: 18, color: '374151' })],
          spacing: { before: 80, after: 40 },
        }));
      }
      paragraphs.push(new Paragraph({
        children: items.map((s, i) => new TextRun({
          text: `${s.name} (${LEVEL_LABELS[s.level] ?? s.level})` + (i < items.length - 1 ? '   ·   ' : ''),
          size: 18, color: '374151',
        })),
        spacing: { before: 0, after: 60 },
      }));
    }
  }

  // Education
  if (profile.educations.length > 0) {
    paragraphs.push(heading2('Education'));
    for (const edu of profile.educations) {
      const dateStr = `${new Date(edu.startDate).getFullYear()} — ${edu.isCurrent ? 'Present' : edu.endDate ? new Date(edu.endDate).getFullYear() : ''}`;
      paragraphs.push(subheading(edu.institution, dateStr));
      paragraphs.push(body(`${edu.degree} — ${edu.field}`));
      paragraphs.push(emptyLine());
    }
  }

  // Certificates
  if (profile.certificates.length > 0) {
    paragraphs.push(heading2('Certifications'));
    for (const c of profile.certificates) {
      paragraphs.push(new Paragraph({
        children: [new TextRun({ text: c.title, bold: true, size: 20 })],
        spacing: { before: 100, after: 30 },
      }));
      const meta: string[] = [];
      if (c.issuer) meta.push(c.issuer);
      if (c.issueDate) meta.push(fmtDate(c.issueDate));
      if (meta.length > 0) paragraphs.push(body(meta.join('  ·  '), '9ca3af'));
    }
  }

  const doc = new Document({
    styles: {
      default: {
        document: {
          run: { font: 'Calibri', size: 20 },
          paragraph: { spacing: { line: 276 } },
        },
      },
    },
    sections: [{
      properties: {
        page: {
          margin: { top: 720, bottom: 720, left: 900, right: 900 },
        },
      },
      children: paragraphs,
    }],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${profile.username}-portfolio.docx`);
}
