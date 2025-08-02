import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Fetch the latest commit from GitHub API
    const response = await fetch('https://api.github.com/repos/oyuh/streamthing/commits/main', {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch commit data');
    }

    const data = await response.json();
    const commitHash = data.sha.substring(0, 7); // Short hash
    const commitDate = new Date(data.commit.committer.date);
    const currentDate = new Date();

    return NextResponse.json({
      commitHash,
      commitDate: commitDate.toISOString(),
      currentDate: currentDate.toISOString(),
      commitUrl: `https://github.com/oyuh/streamthing/commit/${data.sha}`,
    });
  } catch (error) {
    console.error('Error fetching version info:', error);
    return NextResponse.json(
      { error: 'Failed to fetch version information' },
      { status: 500 }
    );
  }
}
