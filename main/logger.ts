// LOGGER: MAIN

import log from "electron-log";

log.initialize({ preload: true });

const isProd: boolean = process.env.NODE_ENV === "production";

log.transports.console.level = false;
log.transports.file.level = isProd ? "warn" : "debug";
log.transports.file.fileName = isProd ? "autographa.log" : "dev.autographa.log";
log.transports.file.maxSize = 15 * 1024 * 1024; // 15 MB
// log.transports.console.format = "{y}-{m}-{d} {h}:{i}:{s} [{level}] {text}";

const error = (filename: string, text: string) => {
    log.error(`${filename}: ${text}`);
};

const warn = (filename: string, text: string) => {
    log.warn(`${filename}: ${text}`);
};

const info = (filename: string, text: string) => {
    log.info(`${filename}: ${text}`);
};

const debug = (filename: string, text: string) => {
    log.debug(`${filename}: ${text}`);
};

const logger = { error, warn, info, debug };

export default logger;

export { log };
