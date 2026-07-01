/**
 * @param {Function} prevFunc previous debounce function to be terminated
 * @param {CallableFunction} cb callback to be execute after timeout    
 * @param {Number} timeout timeout for executing callback   
 * @returns {Promise} 
 */
export const createDebounceFunc = (prevTimer, cb, timeout) => {
    clearTimeout(prevTimer);

    return new Promise((resolve, reject) => {
        setTimeout(async () => {
            try {
                const result = await cb();
                resolve(result);
            } catch (err) {
                reject(err);
            }
        }, timeout);
    });
};