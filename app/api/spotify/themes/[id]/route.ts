import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/client';
import { spotifyThemes } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

// GET - Get specific theme
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const themeId = parseInt(id);

    if (isNaN(themeId)) {
      return NextResponse.json({ error: 'Invalid theme ID' }, { status: 400 });
    }

    const [theme] = await db
      .select()
      .from(spotifyThemes)
      .where(eq(spotifyThemes.id, themeId))
      .limit(1);

    if (!theme) {
      return NextResponse.json({ error: 'Theme not found' }, { status: 404 });
    }

    return NextResponse.json(theme);
  } catch (error) {
    console.error('Error fetching theme:', error);
    return NextResponse.json({ error: 'Failed to fetch theme' }, { status: 500 });
  }
}

// PUT - Update theme
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const themeId = parseInt(id);
    const { name, css, isActive } = await req.json();

    if (isNaN(themeId)) {
      return NextResponse.json({ error: 'Invalid theme ID' }, { status: 400 });
    }

    // If this theme should be active, deactivate all others first
    if (isActive) {
      await db
        .update(spotifyThemes)
        .set({ isActive: false })
        .execute();
    }

    const [updatedTheme] = await db
      .update(spotifyThemes)
      .set({
        name,
        css,
        isActive,
        updatedAt: new Date(),
      })
      .where(eq(spotifyThemes.id, themeId))
      .returning();

    if (!updatedTheme) {
      return NextResponse.json({ error: 'Theme not found' }, { status: 404 });
    }

    return NextResponse.json(updatedTheme);
  } catch (error) {
    console.error('Error updating theme:', error);
    return NextResponse.json({ error: 'Failed to update theme' }, { status: 500 });
  }
}

// DELETE - Delete theme
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const themeId = parseInt(id);

    if (isNaN(themeId)) {
      return NextResponse.json({ error: 'Invalid theme ID' }, { status: 400 });
    }

    const [deletedTheme] = await db
      .delete(spotifyThemes)
      .where(eq(spotifyThemes.id, themeId))
      .returning();

    if (!deletedTheme) {
      return NextResponse.json({ error: 'Theme not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Theme deleted successfully' });
  } catch (error) {
    console.error('Error deleting theme:', error);
    return NextResponse.json({ error: 'Failed to delete theme' }, { status: 500 });
  }
}
