/**
 * @param {function} callback
 * @param {string[]?} signals
 */
export const onExitSignal = (callback, signals = ['SIGTERM', 'SIGINT']) => {
  for (const signal of signals)
    process.on(signal, async () => await callback(signal));
}

/**
 * @param {'true'|'false'|string} string
 * @return {boolean|undefined}
 */
export const stringToBoolean = string => string === 'true' ? true : string === 'false' ? false : undefined;

/**
 * @param {string|number} value
 * @return {boolean}
 */
export const isNumber = value => !isNaN(parseFloat(value));

/**
 * @param {string} string
 * @return {number|undefined}
 */
export const stringToInt = string => isNumber(string) ? parseInt(string) : undefined;