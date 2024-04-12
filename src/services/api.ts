import axios from "axios";
import * as https from "https";
import { GetServerSidePropsContext } from "next";
import { parseCookies } from "nookies";

const agent = new https.Agent({
  rejectUnauthorized: false,
});

export function setupAPIClient(
  ctx: GetServerSidePropsContext | undefined = undefined
) {
  let cookies = parseCookies(ctx);

  const api = axios.create({
    baseURL:
      process.env.NODE_ENV !== "development"
        ? "https://api-app.alpardobrasil.com.br/"
        : "http://localhost:4444/",
    // : "http://192.168.0.155:4444/",
    // : "http://localhost:4444/",
    headers: {
      Authorization: `Bearer ${cookies["nextauth.token"]}`,
    },
    httpsAgent: agent,
  });

  return api;
}
