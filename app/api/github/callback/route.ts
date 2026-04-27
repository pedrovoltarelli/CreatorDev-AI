import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  if (!code) {
    return NextResponse.redirect(new URL("/dashboard/settings?github=error", request.url));
  }

  try {
    const clientId = process.env.GITHUB_CLIENT_ID;
    const clientSecret = process.env.GITHUB_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      console.error("GitHub OAuth credentials not configured");
      return NextResponse.redirect(new URL("/dashboard/settings?github=error", request.url));
    }

    const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        state,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      console.error("GitHub token exchange error:", tokenData.error);
      return NextResponse.redirect(new URL("/dashboard/settings?github=error", request.url));
    }

    const accessToken = tokenData.access_token;

    // Get user info to verify the token works
    const userResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `token ${accessToken}`,
        "User-Agent": "CreatorDev-AI",
      },
    });

    if (!userResponse.ok) {
      return NextResponse.redirect(new URL("/dashboard/settings?github=error", request.url));
    }

    const userData = await userResponse.json();

    // Redirect to settings with the token (we'll store it client-side)
    const response = NextResponse.redirect(
      new URL(`/dashboard/settings?github=connected&token=${accessToken}&user=${userData.login}`, request.url)
    );

    return response;
  } catch (error) {
    console.error("GitHub OAuth error:", error);
    return NextResponse.redirect(new URL("/dashboard/settings?github=error", request.url));
  }
}
