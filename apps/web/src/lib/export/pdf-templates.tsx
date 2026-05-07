import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

export interface ExportProfile {
  name?: string | null;
  username: string;
  headline?: string | null;
  bio?: string | null;
  location?: string | null;
  website?: string | null;
  github?: string | null;
  linkedin?: string | null;
  phone?: string | null;
  avatarUrl?: string | null;
  isOpenToWork?: boolean;
  skills: { id: string; name: string; level: string; category?: string | null }[];
  projects: { id: string; title: string; description: string; techs: string[]; github?: string | null; demo?: string | null; featured: boolean }[];
  experiences: { id: string; company: string; position: string; description?: string | null; startDate: string; endDate?: string | null; isCurrent: boolean; location?: string | null }[];
  educations: { id: string; institution: string; degree: string; field: string; startDate: string; endDate?: string | null; isCurrent: boolean }[];
  certificates: { id: string; title: string; issuer?: string | null; issueDate?: string | null; url?: string | null }[];
}

const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
const trunc = (s: string, n: number) => (s.length > n ? s.slice(0, n) + '...' : s);
const cleanUrl = (url: string) => url.replace(/^https?:\/\/(www\.)?/, '');

// ─── Template 1: Classic ──────────────────────────────────────────────────────

const cls = StyleSheet.create({
  page: { fontFamily: 'Helvetica', fontSize: 9, color: '#1e293b', backgroundColor: '#fff' },
  header: { backgroundColor: '#1e3a5f', padding: '24 36 18 36' },
  hName: { fontFamily: 'Helvetica-Bold', fontSize: 22, color: '#fff', marginBottom: 3 },
  hHeadline: { fontSize: 10, color: '#93c5fd', marginBottom: 10 },
  hRow: { flexDirection: 'row', flexWrap: 'wrap' },
  hContact: { fontSize: 7.5, color: '#cbd5e1', marginRight: 16, marginBottom: 3 },
  hOpenWork: { fontSize: 7, color: '#86efac', marginBottom: 8 },
  body: { flexDirection: 'row', flex: 1 },
  left: { width: 178, backgroundColor: '#f8fafc', padding: '16 14 20 14', borderRightWidth: 1, borderRightColor: '#e2e8f0' },
  right: { flex: 1, padding: '16 24 20 16' },
  secHead: { fontFamily: 'Helvetica-Bold', fontSize: 7, color: '#1e40af', letterSpacing: 1.2, paddingBottom: 3, marginBottom: 7, marginTop: 13, borderBottomWidth: 1, borderBottomColor: '#bfdbfe' },
  firstSec: { marginTop: 0 },
  item: { marginBottom: 9 },
  skillRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  skillName: { fontSize: 8.5, flex: 1 },
  skillCatLabel: { fontSize: 7, color: '#94a3b8', marginBottom: 4, marginTop: 2, fontFamily: 'Helvetica-Bold' },
  dotsRow: { flexDirection: 'row' },
  dot: { width: 6, height: 6, borderRadius: 3, marginRight: 2 },
  expRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 },
  expCo: { fontFamily: 'Helvetica-Bold', fontSize: 9, color: '#1e40af', flex: 1 },
  expDates: { fontSize: 7.5, color: '#64748b' },
  expPos: { fontFamily: 'Helvetica-Bold', fontSize: 8.5, marginBottom: 2 },
  expLoc: { fontSize: 7.5, color: '#64748b', marginBottom: 2 },
  desc: { fontSize: 7.5, color: '#475569', lineHeight: 1.5 },
  projTitle: { fontFamily: 'Helvetica-Bold', fontSize: 9 },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 3 },
  tag: { backgroundColor: '#dbeafe', color: '#1e40af', fontSize: 6.5, paddingHorizontal: 4, paddingVertical: 1.5, borderRadius: 2, marginRight: 3, marginBottom: 2 },
  eduInst: { fontFamily: 'Helvetica-Bold', fontSize: 9 },
  eduSub: { fontSize: 8, color: '#475569', marginTop: 1 },
  eduDate: { fontSize: 7.5, color: '#94a3b8', marginTop: 1 },
  certTitle: { fontFamily: 'Helvetica-Bold', fontSize: 8.5 },
  certSub: { fontSize: 7.5, color: '#64748b', marginTop: 1 },
  badge: { backgroundColor: '#dcfce7', color: '#166534', fontSize: 6, paddingHorizontal: 5, paddingVertical: 1.5, borderRadius: 8 },
  openBadge: { backgroundColor: '#dcfce7', color: '#166534', fontSize: 7, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8, marginBottom: 8, alignSelf: 'flex-start' },
});

const LEVEL_DOTS: Record<string, number> = { BEGINNER: 1, INTERMEDIATE: 2, ADVANCED: 3, EXPERT: 4 };
const LEVEL_COLORS: Record<string, string> = { BEGINNER: '#94a3b8', INTERMEDIATE: '#f59e0b', ADVANCED: '#22c55e', EXPERT: '#2563eb' };

function SkillDots({ level }: { level: string }) {
  const filled = LEVEL_DOTS[level] ?? 2;
  const color = LEVEL_COLORS[level] ?? '#94a3b8';
  return (
    <View style={cls.dotsRow}>
      {[0, 1, 2, 3].map(i => (
        <View key={i} style={[cls.dot, { backgroundColor: i < filled ? color : '#e2e8f0' }]} />
      ))}
    </View>
  );
}

export function ClassicTemplate({ profile }: { profile: ExportProfile }) {
  const byCat = profile.skills.reduce((a, s) => {
    const k = s.category || 'General';
    (a[k] = a[k] || []).push(s);
    return a;
  }, {} as Record<string, ExportProfile['skills']>);

  return (
    <Document>
      <Page size="A4" style={cls.page}>
        {/* Header */}
        <View style={cls.header}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <View style={{ flex: 1 }}>
              <Text style={cls.hName}>{profile.name || profile.username}</Text>
              {profile.headline && <Text style={cls.hHeadline}>{profile.headline}</Text>}
              {profile.isOpenToWork && <Text style={cls.hOpenWork}>● Open to Work</Text>}
              <View style={cls.hRow}>
                {profile.location && <Text style={cls.hContact}>Location: {profile.location}</Text>}
                {profile.github && <Text style={cls.hContact}>GitHub: {cleanUrl(profile.github)}</Text>}
                {profile.linkedin && <Text style={cls.hContact}>LinkedIn: {cleanUrl(profile.linkedin)}</Text>}
                {profile.website && <Text style={cls.hContact}>Web: {cleanUrl(profile.website)}</Text>}
                {profile.phone && <Text style={cls.hContact}>Tel: {profile.phone}</Text>}
              </View>
            </View>
            {profile.avatarUrl && (
              <Image src={profile.avatarUrl} style={{ width: 62, height: 62, borderRadius: 31, marginLeft: 16 }} />
            )}
          </View>
        </View>

        {/* Body */}
        <View style={cls.body}>
          {/* Left */}
          <View style={cls.left}>
            {profile.skills.length > 0 && (
              <View>
                <Text style={[cls.secHead, cls.firstSec]}>SKILLS</Text>
                {Object.entries(byCat).map(([cat, items]) => (
                  <View key={cat}>
                    {Object.keys(byCat).length > 1 && <Text style={cls.skillCatLabel}>{cat.toUpperCase()}</Text>}
                    {items.map(s => (
                      <View key={s.id} style={cls.skillRow}>
                        <Text style={cls.skillName}>{s.name}</Text>
                        <SkillDots level={s.level} />
                      </View>
                    ))}
                  </View>
                ))}
              </View>
            )}

            {profile.certificates.length > 0 && (
              <View>
                <Text style={cls.secHead}>CERTIFICATIONS</Text>
                {profile.certificates.map(c => (
                  <View key={c.id} style={{ marginBottom: 6 }}>
                    <Text style={cls.certTitle}>{c.title}</Text>
                    {c.issuer && <Text style={cls.certSub}>{c.issuer}</Text>}
                    {c.issueDate && <Text style={[cls.certSub, { fontSize: 7 }]}>{fmtDate(c.issueDate)}</Text>}
                  </View>
                ))}
              </View>
            )}

            {profile.bio && (
              <View>
                <Text style={cls.secHead}>ABOUT</Text>
                <Text style={cls.desc}>{trunc(profile.bio, 220)}</Text>
              </View>
            )}
          </View>

          {/* Right */}
          <View style={cls.right}>
            {profile.experiences.length > 0 && (
              <View>
                <Text style={[cls.secHead, cls.firstSec]}>WORK EXPERIENCE</Text>
                {profile.experiences.map(e => (
                  <View key={e.id} style={cls.item}>
                    <View style={cls.expRow}>
                      <Text style={cls.expCo}>{e.company}</Text>
                      <Text style={cls.expDates}>
                        {fmtDate(e.startDate)} — {e.isCurrent ? 'Present' : e.endDate ? fmtDate(e.endDate) : ''}
                      </Text>
                    </View>
                    <Text style={cls.expPos}>{e.position}</Text>
                    {e.location && <Text style={cls.expLoc}>{e.location}</Text>}
                    {e.description && <Text style={cls.desc}>{trunc(e.description, 200)}</Text>}
                  </View>
                ))}
              </View>
            )}

            {profile.projects.length > 0 && (
              <View>
                <Text style={cls.secHead}>PROJECTS</Text>
                {profile.projects.map(p => (
                  <View key={p.id} style={cls.item}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
                      <Text style={[cls.projTitle, { marginRight: 6 }]}>{p.title}</Text>
                      {p.featured && <Text style={cls.badge}>Featured</Text>}
                    </View>
                    <Text style={cls.desc}>{trunc(p.description, 130)}</Text>
                    {p.techs.length > 0 && (
                      <View style={cls.tagsRow}>
                        {p.techs.slice(0, 6).map(t => <Text key={t} style={cls.tag}>{t}</Text>)}
                      </View>
                    )}
                    {(p.github || p.demo) && (
                      <View style={[cls.tagsRow, { marginTop: 2 }]}>
                        {p.github && <Text style={[cls.tag, { backgroundColor: '#f1f5f9', color: '#475569' }]}>GitHub: {cleanUrl(p.github)}</Text>}
                        {p.demo && <Text style={[cls.tag, { backgroundColor: '#f0fdf4', color: '#166534' }]}>Demo: {cleanUrl(p.demo)}</Text>}
                      </View>
                    )}
                  </View>
                ))}
              </View>
            )}

            {profile.educations.length > 0 && (
              <View>
                <Text style={cls.secHead}>EDUCATION</Text>
                {profile.educations.map(e => (
                  <View key={e.id} style={cls.item}>
                    <Text style={cls.eduInst}>{e.institution}</Text>
                    <Text style={cls.eduSub}>{e.degree} — {e.field}</Text>
                    <Text style={cls.eduDate}>
                      {new Date(e.startDate).getFullYear()} — {e.isCurrent ? 'Present' : e.endDate ? new Date(e.endDate).getFullYear() : ''}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
      </Page>
    </Document>
  );
}

// ─── Template 2: Modern Dark ─────────────────────────────────────────────────

const mod = StyleSheet.create({
  page: { fontFamily: 'Helvetica', fontSize: 9, color: '#e6edf3', backgroundColor: '#0d1117' },
  header: { backgroundColor: '#161b22', padding: '28 36 22 36', borderBottomWidth: 2, borderBottomColor: '#00ff88' },
  hTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
  hName: { fontFamily: 'Helvetica-Bold', fontSize: 24, color: '#fff', marginBottom: 4 },
  hHeadline: { fontSize: 11, color: '#00ff88' },
  hOpenBadge: { backgroundColor: 'rgba(0,255,136,0.15)', color: '#00ff88', fontSize: 7.5, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10, borderWidth: 1, borderColor: '#00ff88' },
  hContactRow: { flexDirection: 'row', flexWrap: 'wrap' },
  hContact: { fontSize: 7.5, color: '#7d8590', marginRight: 18, marginBottom: 2 },
  body: { flexDirection: 'row', flex: 1 },
  left: { width: 168, backgroundColor: '#161b22', padding: '18 14 20 16', borderRightWidth: 1, borderRightColor: '#21262d' },
  right: { flex: 1, padding: '18 24 20 18' },
  secHead: { fontFamily: 'Helvetica-Bold', fontSize: 7, color: '#00ff88', letterSpacing: 1.2, marginBottom: 8, marginTop: 14, paddingBottom: 3, borderBottomWidth: 1, borderBottomColor: 'rgba(0,255,136,0.25)' },
  firstSec: { marginTop: 0 },
  item: { marginBottom: 10 },
  skillRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  skillDot: { width: 5, height: 5, borderRadius: 2.5, backgroundColor: '#00ff88', marginRight: 7 },
  skillName: { fontSize: 8.5, color: '#e6edf3', flex: 1 },
  skillLevel: { fontSize: 7, color: '#7d8590', fontFamily: 'Helvetica-Oblique' },
  skillCatLabel: { fontSize: 6.5, color: '#7d8590', letterSpacing: 0.8, marginBottom: 5, marginTop: 8, fontFamily: 'Helvetica-Bold' },
  expCo: { fontFamily: 'Helvetica-Bold', fontSize: 9.5, color: '#00ff88', marginBottom: 1 },
  expPos: { fontFamily: 'Helvetica-Bold', fontSize: 9, color: '#e6edf3', marginBottom: 2 },
  expMeta: { fontSize: 7.5, color: '#7d8590', marginBottom: 3 },
  expDesc: { fontSize: 7.5, color: '#c9d1d9', lineHeight: 1.5 },
  projTitle: { fontFamily: 'Helvetica-Bold', fontSize: 9.5, color: '#e6edf3', marginBottom: 2 },
  projDesc: { fontSize: 7.5, color: '#c9d1d9', lineHeight: 1.4, marginBottom: 3 },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap' },
  tag: { backgroundColor: 'rgba(0,255,136,0.1)', color: '#00ff88', borderWidth: 1, borderColor: 'rgba(0,255,136,0.3)', fontSize: 6.5, paddingHorizontal: 5, paddingVertical: 1.5, borderRadius: 3, marginRight: 3, marginBottom: 2 },
  eduInst: { fontFamily: 'Helvetica-Bold', fontSize: 9, color: '#e6edf3' },
  eduSub: { fontSize: 8, color: '#7d8590', marginTop: 1 },
  certTitle: { fontFamily: 'Helvetica-Bold', fontSize: 8.5, color: '#e6edf3' },
  certSub: { fontSize: 7.5, color: '#7d8590', marginTop: 1 },
  divider: { height: 1, backgroundColor: '#21262d', marginVertical: 6 },
  bioText: { fontSize: 7.5, color: '#c9d1d9', lineHeight: 1.6 },
});

const LEVEL_LABELS: Record<string, string> = { BEGINNER: 'Beginner', INTERMEDIATE: 'Mid', ADVANCED: 'Advanced', EXPERT: 'Expert' };

export function ModernTemplate({ profile }: { profile: ExportProfile }) {
  const byCat = profile.skills.reduce((a, s) => {
    const k = s.category || 'General';
    (a[k] = a[k] || []).push(s);
    return a;
  }, {} as Record<string, ExportProfile['skills']>);

  return (
    <Document>
      <Page size="A4" style={mod.page}>
        {/* Header */}
        <View style={mod.header}>
          <View style={mod.hTop}>
            <View style={{ flex: 1 }}>
              <Text style={mod.hName}>{profile.name || profile.username}</Text>
              {profile.headline && <Text style={mod.hHeadline}>{profile.headline}</Text>}
            </View>
            {profile.avatarUrl && (
              <Image src={profile.avatarUrl} style={{ width: 64, height: 64, borderRadius: 32, marginLeft: 16, border: '2px solid #00ff88' }} />
            )}
            {profile.isOpenToWork && <Text style={[mod.hOpenBadge, { marginLeft: profile.avatarUrl ? 10 : 0 }]}>Open to Work</Text>}
          </View>
          <View style={mod.hContactRow}>
            {profile.location && <Text style={mod.hContact}>{profile.location}</Text>}
            {profile.github && <Text style={mod.hContact}>github: {cleanUrl(profile.github)}</Text>}
            {profile.linkedin && <Text style={mod.hContact}>linkedin: {cleanUrl(profile.linkedin)}</Text>}
            {profile.website && <Text style={mod.hContact}>{cleanUrl(profile.website)}</Text>}
            {profile.phone && <Text style={mod.hContact}>{profile.phone}</Text>}
          </View>
        </View>

        {/* Body */}
        <View style={mod.body}>
          {/* Left sidebar */}
          <View style={mod.left}>
            {profile.bio && (
              <View>
                <Text style={[mod.secHead, mod.firstSec]}>ABOUT</Text>
                <Text style={mod.bioText}>{trunc(profile.bio, 250)}</Text>
              </View>
            )}

            {profile.skills.length > 0 && (
              <View>
                <Text style={profile.bio ? mod.secHead : [mod.secHead, mod.firstSec]}>SKILLS</Text>
                {Object.entries(byCat).map(([cat, items]) => (
                  <View key={cat}>
                    {Object.keys(byCat).length > 1 && (
                      <Text style={mod.skillCatLabel}>{cat.toUpperCase()}</Text>
                    )}
                    {items.map(s => (
                      <View key={s.id} style={mod.skillRow}>
                        <View style={mod.skillDot} />
                        <Text style={mod.skillName}>{s.name}</Text>
                        <Text style={mod.skillLevel}>{LEVEL_LABELS[s.level] ?? s.level}</Text>
                      </View>
                    ))}
                  </View>
                ))}
              </View>
            )}

            {profile.certificates.length > 0 && (
              <View>
                <Text style={mod.secHead}>CERTS</Text>
                {profile.certificates.map(c => (
                  <View key={c.id} style={{ marginBottom: 6 }}>
                    <Text style={mod.certTitle}>{trunc(c.title, 30)}</Text>
                    {c.issuer && <Text style={mod.certSub}>{c.issuer}</Text>}
                    {c.issueDate && <Text style={[mod.certSub, { fontSize: 7 }]}>{fmtDate(c.issueDate)}</Text>}
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Right content */}
          <View style={mod.right}>
            {profile.experiences.length > 0 && (
              <View>
                <Text style={[mod.secHead, mod.firstSec]}>WORK EXPERIENCE</Text>
                {profile.experiences.map((e, i) => (
                  <View key={e.id} style={mod.item}>
                    {i > 0 && <View style={mod.divider} />}
                    <Text style={mod.expCo}>{e.company}</Text>
                    <Text style={mod.expPos}>{e.position}</Text>
                    <Text style={mod.expMeta}>
                      {fmtDate(e.startDate)} — {e.isCurrent ? 'Present' : e.endDate ? fmtDate(e.endDate) : ''}
                      {e.location ? `  ·  ${e.location}` : ''}
                    </Text>
                    {e.description && <Text style={mod.expDesc}>{trunc(e.description, 200)}</Text>}
                  </View>
                ))}
              </View>
            )}

            {profile.projects.length > 0 && (
              <View>
                <Text style={mod.secHead}>PROJECTS</Text>
                {profile.projects.map((p, i) => (
                  <View key={p.id} style={mod.item}>
                    {i > 0 && <View style={mod.divider} />}
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
                      <Text style={[mod.projTitle, { marginRight: 6 }]}>{p.title}</Text>
                      {p.featured && (
                        <Text style={[mod.tag, { borderColor: '#f59e0b', color: '#f59e0b', backgroundColor: 'rgba(245,158,11,0.1)' }]}>
                          Featured
                        </Text>
                      )}
                    </View>
                    <Text style={mod.projDesc}>{trunc(p.description, 130)}</Text>
                    {p.techs.length > 0 && (
                      <View style={mod.tagsRow}>
                        {p.techs.slice(0, 7).map(t => <Text key={t} style={mod.tag}>{t}</Text>)}
                      </View>
                    )}
                  </View>
                ))}
              </View>
            )}

            {profile.educations.length > 0 && (
              <View>
                <Text style={mod.secHead}>EDUCATION</Text>
                {profile.educations.map(e => (
                  <View key={e.id} style={mod.item}>
                    <Text style={mod.eduInst}>{e.institution}</Text>
                    <Text style={mod.eduSub}>{e.degree} — {e.field}</Text>
                    <Text style={[mod.eduSub, { fontSize: 7 }]}>
                      {new Date(e.startDate).getFullYear()} — {e.isCurrent ? 'Present' : e.endDate ? new Date(e.endDate).getFullYear() : ''}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
      </Page>
    </Document>
  );
}

// ─── Template 3: Minimal ─────────────────────────────────────────────────────

const min = StyleSheet.create({
  page: { fontFamily: 'Helvetica', fontSize: 9.5, color: '#111827', backgroundColor: '#fff', padding: '44 52 44 52' },
  name: { fontFamily: 'Helvetica-Bold', fontSize: 26, color: '#111827', marginBottom: 4 },
  headline: { fontSize: 12, color: '#6b7280', marginBottom: 8 },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 4 },
  metaItem: { fontSize: 8, color: '#9ca3af', marginRight: 18, marginBottom: 3 },
  openBadge: { fontSize: 7.5, color: '#059669', marginBottom: 12 },
  divider: { height: 1, backgroundColor: '#e5e7eb', marginVertical: 16 },
  secHead: { fontFamily: 'Helvetica-Bold', fontSize: 9, color: '#111827', letterSpacing: 0.8, marginBottom: 10, paddingLeft: 8, borderLeftWidth: 2, borderLeftColor: '#00ff88' },
  item: { marginBottom: 11, paddingLeft: 0 },
  expRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  expCo: { fontFamily: 'Helvetica-Bold', fontSize: 9.5, flex: 1 },
  expDates: { fontSize: 8, color: '#6b7280' },
  expPos: { fontSize: 9, color: '#374151', marginBottom: 2, marginTop: 1 },
  desc: { fontSize: 8, color: '#6b7280', lineHeight: 1.6 },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 3 },
  tag: { backgroundColor: '#f9fafb', color: '#374151', borderWidth: 1, borderColor: '#e5e7eb', fontSize: 7, paddingHorizontal: 5, paddingVertical: 2, borderRadius: 3, marginRight: 4, marginBottom: 3 },
  skillsWrap: { flexDirection: 'row', flexWrap: 'wrap' },
  skillChip: { backgroundColor: '#f3f4f6', fontSize: 8.5, paddingHorizontal: 9, paddingVertical: 3, borderRadius: 12, marginRight: 5, marginBottom: 5, color: '#374151' },
  skillDot: { color: '#00ff88', marginRight: 2 },
  eduInst: { fontFamily: 'Helvetica-Bold', fontSize: 9.5 },
  eduSub: { fontSize: 8.5, color: '#6b7280', marginTop: 2 },
  certTitle: { fontFamily: 'Helvetica-Bold', fontSize: 9 },
  certSub: { fontSize: 8, color: '#9ca3af', marginTop: 1 },
});

export function MinimalTemplate({ profile }: { profile: ExportProfile }) {
  return (
    <Document>
      <Page size="A4" style={min.page}>
        {/* Name block */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 0 }}>
          <View style={{ flex: 1 }}>
            <Text style={min.name}>{profile.name || profile.username}</Text>
            {profile.headline && <Text style={min.headline}>{profile.headline}</Text>}
            {profile.isOpenToWork && <Text style={min.openBadge}>● Available for opportunities</Text>}
          </View>
          {profile.avatarUrl && (
            <Image src={profile.avatarUrl} style={{ width: 58, height: 58, borderRadius: 29, marginLeft: 16 }} />
          )}
        </View>

        {/* Contact row */}
        <View style={min.metaRow}>
          {profile.location && <Text style={min.metaItem}>{profile.location}</Text>}
          {profile.github && <Text style={min.metaItem}>{cleanUrl(profile.github)}</Text>}
          {profile.linkedin && <Text style={min.metaItem}>{cleanUrl(profile.linkedin)}</Text>}
          {profile.website && <Text style={min.metaItem}>{cleanUrl(profile.website)}</Text>}
          {profile.phone && <Text style={min.metaItem}>{profile.phone}</Text>}
        </View>

        <View style={min.divider} />

        {/* Bio */}
        {profile.bio && (
          <View style={{ marginBottom: 16 }}>
            <Text style={min.secHead}>About</Text>
            <Text style={min.desc}>{trunc(profile.bio, 300)}</Text>
          </View>
        )}

        {/* Experience */}
        {profile.experiences.length > 0 && (
          <View style={{ marginBottom: 16 }}>
            <Text style={min.secHead}>Experience</Text>
            {profile.experiences.map(e => (
              <View key={e.id} style={min.item}>
                <View style={min.expRow}>
                  <Text style={min.expCo}>{e.company}</Text>
                  <Text style={min.expDates}>
                    {fmtDate(e.startDate)} — {e.isCurrent ? 'Present' : e.endDate ? fmtDate(e.endDate) : ''}
                  </Text>
                </View>
                <Text style={min.expPos}>{e.position}{e.location ? `  ·  ${e.location}` : ''}</Text>
                {e.description && <Text style={min.desc}>{trunc(e.description, 200)}</Text>}
              </View>
            ))}
          </View>
        )}

        {/* Projects */}
        {profile.projects.length > 0 && (
          <View style={{ marginBottom: 16 }}>
            <Text style={min.secHead}>Projects</Text>
            {profile.projects.map(p => (
              <View key={p.id} style={min.item}>
                <Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 9.5, marginBottom: 2 }}>{p.title}</Text>
                <Text style={min.desc}>{trunc(p.description, 130)}</Text>
                {p.techs.length > 0 && (
                  <View style={min.tagsRow}>
                    {p.techs.slice(0, 7).map(t => <Text key={t} style={min.tag}>{t}</Text>)}
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Skills */}
        {profile.skills.length > 0 && (
          <View style={{ marginBottom: 16 }}>
            <Text style={min.secHead}>Skills</Text>
            <View style={min.skillsWrap}>
              {profile.skills.map(s => (
                <Text key={s.id} style={min.skillChip}>{s.name}</Text>
              ))}
            </View>
          </View>
        )}

        {/* Education */}
        {profile.educations.length > 0 && (
          <View style={{ marginBottom: 16 }}>
            <Text style={min.secHead}>Education</Text>
            {profile.educations.map(e => (
              <View key={e.id} style={min.item}>
                <Text style={min.eduInst}>{e.institution}</Text>
                <Text style={min.eduSub}>{e.degree} — {e.field}</Text>
                <Text style={[min.eduSub, { fontSize: 7.5 }]}>
                  {new Date(e.startDate).getFullYear()} — {e.isCurrent ? 'Present' : e.endDate ? new Date(e.endDate).getFullYear() : ''}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Certificates */}
        {profile.certificates.length > 0 && (
          <View>
            <Text style={min.secHead}>Certifications</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {profile.certificates.map(c => (
                <View key={c.id} style={{ width: '48%', marginBottom: 8, marginRight: '2%' }}>
                  <Text style={min.certTitle}>{c.title}</Text>
                  {c.issuer && <Text style={min.certSub}>{c.issuer}</Text>}
                  {c.issueDate && <Text style={[min.certSub, { fontSize: 7 }]}>{fmtDate(c.issueDate)}</Text>}
                </View>
              ))}
            </View>
          </View>
        )}
      </Page>
    </Document>
  );
}
