import pino, { TransportTargetOptions } from "pino";

const transports: TransportTargetOptions[] = [
  {
    target: "pino-pretty",
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
    redact: [
      "req.headers.cookie",
      "res.headers.set-cookie",
      "req.headers.authorization",
    ],
  },
  pino.transport({ targets: transports })
);
