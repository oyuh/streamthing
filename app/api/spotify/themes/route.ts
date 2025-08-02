import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/client';
import { spotifyThemes } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';

// GET - Get all themes or active theme
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const activeOnly = searchParams.get('active') === 'true';

    if (activeOnly) {
      // Get only the active theme
      const [activeTheme] = await db
        .select()
        .from(spotifyThemes)
        .where(eq(spotifyThemes.isActive, true))
        .limit(1);

      return NextResponse.json(activeTheme || null);
    } else {
      // Get all themes
      const themes = await db
        .select()
        .from(spotifyThemes)
        .orderBy(desc(spotifyThemes.updatedAt));

      return NextResponse.json(themes);
    }
  } catch (error) {
    console.error('Error fetching themes:', error);
    return NextResponse.json({ error: 'Failed to fetch themes' }, { status: 500 });
  }
}

// POST - Create new theme
export async function POST(req: NextRequest) {
  try {
    const { name, css, isActive } = await req.json();

    if (!name || !css) {
      return NextResponse.json({ error: 'Name and CSS are required' }, { status: 400 });
    }

    // If this theme should be active, deactivate all others first
    if (isActive) {
      await db
        .update(spotifyThemes)
        .set({ isActive: false })
        .execute();
    }

    const [newTheme] = await db
      .insert(spotifyThemes)
      .values({
        name,
        css,
        isActive: isActive || false,
      })
      .returning();

    return NextResponse.json(newTheme);
  } catch (error) {
    console.error('Error creating theme:', error);
    if (error instanceof Error && error.message.includes('unique')) {
      return NextResponse.json({ error: 'Theme name already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to create theme' }, { status: 500 });
  }
}
