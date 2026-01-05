import fs from "fs";

export const publicKey = fs.readFileSync("public.pem", "utf-8");

export const privateKey = fs.readFileSync("private.pem", "utf-8");

export const signingAlgo = "RS256";
