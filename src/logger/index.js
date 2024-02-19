import pino from 'pino';

const logger = pino({
  transport: {
    targets: [
      {
        target: 'pino-pretty',
        options: {
          ignore: 'pid,hostname',
          colorize: true,
          translateTime: 'SYS:dd-mm-yyyy HH:MM:ss',
        },
      },
      {
        level: 'error',
        target: 'pino/file',
        options: { destination: `${__dirname}/api.log` },
      },
    ],
  },
});

export default logger;
