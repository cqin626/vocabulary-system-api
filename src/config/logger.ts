import pino, { TransportTargetOptions } from "pino";

const redactList = [
  "req.headers.cookie",
  "res.headers.set-cookie",
  "req.headers.authorization",
];

const transports: TransportTargetOptions[] = [
  {
    target: "pino-pretty",
    level: "debug",
    options: {
      translateTime: "SYS:yyyy-mm-dd HH:MM:ss",
      ignore: "pid,hostname",
    },
  },
  {
    target: "pino/file",
    options: { destination: "./logs/app.log", mkdir: true },
  },
];

export const logger = pino(
  {
    redact: redactList,
  },
  pino.transport({ targets: transports })
);
