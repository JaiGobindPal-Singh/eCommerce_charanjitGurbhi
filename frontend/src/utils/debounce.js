/**
 * @param {Function} prevFunc previous debounce function to be terminated
 * @param {CallableFunction} cb callback to be execute after timeout    
 * @param {Number} timeout timeout for executing callback   
 * @returns {Promise} 
 */
export const createDebounceFunc = (prevFunc, cb, timeout) => {
    clearTimeout(prevFunc);       //clearing previous timeout
    return setTimeout(() => {
        cb();
    }, timeout);
}