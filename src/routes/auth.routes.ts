import { Router } from "express";
import axios from "axios";
const router = Router();

router.get("/spotify/login", (_req, res) => {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const redirectUri = process.env.SPOTIFY_REDIRECT_URI;

  const scope = [
    "user-top-read",

    "user-library-read",

    "playlist-modify-public",

    "playlist-modify-private",

    "user-read-recently-played",

    "user-read-email",

    "user-read-private",
  ].join(" ");

  const spotifyAuthUrl =
    `https://accounts.spotify.com/authorize?` +
    `client_id=${clientId}` +
    `&response_type=code` +
    `&redirect_uri=${encodeURIComponent(redirectUri!)}` +
    `&scope=${encodeURIComponent(scope)}`;
  res.redirect(spotifyAuthUrl);
});

router.get("/spotify/callback", async (req, res) => {
  const code = req.query.code;

  const tokenResponse = await axios.post(
    "https://accounts.spotify.com/api/token",

    new URLSearchParams({
      grant_type: "authorization_code",

      code: code as string,

      redirect_uri: process.env.SPOTIFY_REDIRECT_URI!,

      client_id: process.env.SPOTIFY_CLIENT_ID!,

      client_secret: process.env.SPOTIFY_CLIENT_SECRET!,
    }),

    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    },
  );

  const accessToken = tokenResponse.data.access_token;

  res.redirect(`https://moodify-ui-5r1k.vercel.app/?token=${accessToken}`);
});

export default router;
