import { NextResponse } from 'next/server';

const CHAPTER_URL = 'https://gdg.community.dev/gdg-on-campus-university-of-nigeria-nsukka-nigeria/';

function stripTags(value: string): string {
  return value.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

const monthsMap: Record<string, string> = {
  ene: 'Jan', feb: 'Feb', mar: 'Mar', abr: 'Apr', may: 'May', jun: 'Jun',
  jul: 'Jul', ago: 'Aug', sep: 'Sep', oct: 'Oct', nov: 'Nov', dic: 'Dec',
  jan: 'Jan', apr: 'Apr', aug: 'Aug', dec: 'Dec'
};

function parseDate(textContent: string): string | null {
  let match = textContent.match(/([A-Za-z]{3})\s+(\d{1,2}),\s+(\d{4})/);
  if (match) {
    const parsed = new Date(`${match[1]} ${match[2]}, ${match[3]}`);
    if (!isNaN(parsed.getTime())) return parsed.toISOString();
  }
  match = textContent.match(/(\d{1,2})\s+([A-Za-z]{3,})\s+(\d{4})/i);
  if (match) {
    const day = match[1];
    const monthRaw = match[2].toLowerCase().substring(0, 3);
    const month = monthsMap[monthRaw] || monthRaw;
    const parsed = new Date(`${month} ${day}, ${match[3]}`);
    if (!isNaN(parsed.getTime())) return parsed.toISOString();
  }
  return null;
}

function parseEventFromAnchor(anchorHtml: string, href: string) {
  const textContent = stripTags(anchorHtml);
  if (!textContent) return null;

  const date = parseDate(textContent);
  const imageMatch = anchorHtml.match(/<img[^>]+src=["']([^"']+)["']/i);
  const locationMatch = textContent.match(/GDG on Campus.*$/i);

  const cleanedText = textContent.replace(/\s+/g, ' ').trim();
  const freeRegistrationIndex = cleanedText.indexOf('Free registration');
  let title = cleanedText;

  if (freeRegistrationIndex >= 0) {
    const afterFreeRegistration = cleanedText.slice(freeRegistrationIndex + 'Free registration'.length).trim();
    const locationIndex = afterFreeRegistration.search(/GDG on Campus/i);
    title = locationIndex >= 0 ? afterFreeRegistration.slice(0, locationIndex).trim() : afterFreeRegistration;
  }

  const location = locationMatch ? locationMatch[0].trim() : null;

  return {
    id: href,
    title: title || 'GDG Community Event',
    description: title || cleanedText,
    date: date || new Date().toISOString(),
    start_time: null,
    end_time: null,
    image_url: imageMatch?.[1] ?? null,
    location,
    external_url: href,
    source: 'gdg-community',
  };
}

export async function GET() {
  try {
    const response = await fetch(CHAPTER_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; GDGWebsiteBot/1.0)',
        Accept: 'text/html,application/xhtml+xml',
      },
      redirect: 'follow',
    });

    if (!response.ok) {
      return NextResponse.json({ events: [] }, { status: response.status });
    }

    const html = await response.text();
    const matches = Array.from(
      html.matchAll(/<a\b[^>]*href=["']([^"']*\/events\/details\/[^"']*)["'][^>]*>(.*?)<\/a>/gis)
    );

    const events = matches
      .map((match) => parseEventFromAnchor(match[2] ?? '', match[1] ?? ''))
      .filter(Boolean)
      .slice(0, 8);

    return NextResponse.json({ events });
  } catch {
    return NextResponse.json({ events: [] }, { status: 500 });
  }
}
