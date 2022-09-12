import debug from "debug";

const log = (path: string, message: string): void => {
  const _log: debug.IDebugger = debug("telstat" + (path ? `:${path}` : ""));
  _log(message);
};

export default log;
