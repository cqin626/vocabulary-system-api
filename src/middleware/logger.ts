import pino, { TransportTargetOptions } from "pino";

// Security concerns are not considered for the current version (sensitive fields should be redacted)
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

export const logger = pino(pino.transport({ targets: transports }));
