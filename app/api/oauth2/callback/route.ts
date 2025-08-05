import { NextResponse } from "next/server";
import oauth2Client from "../../../lib/google-oauth";
import { cookies } from "next/headers";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error) {
    return NextResponse.json({ error: "Google OAuth Error: " + error });
  }

  if (!code) {
    return NextResponse.json({ error: "Authorization code not found" });
  }

  //let's exchange the code for an access token
  try {
    const { tokens } = await oauth2Client.getToken(code);
    console.log(tokens);
    //this stores the token in the oauth2Client
    //oauth2Client.setCredentials(tokens);
    //store the token in a cookie or a database
    const cookieStore = await cookies();
    // Redirect to dashboard with the access token
    const redirectUrl = `/dashboard?token=${tokens.access_token}`;
    return Response.redirect(new URL(redirectUrl, req.url));

    return NextResponse.redirect(new URL("/dashboard", req.url));
  } catch (error) {
    return NextResponse.json({
      error: "Failed to exchange code for access token" + error,
    });
  }
}
