
/** Converts milliseconds to a minutes:seconds string */
export function Convert(ms: number): string {

    let minutes = Math.floor(ms / 60000);
    let seconds = parseInt(((ms % 60000) / 1000).toFixed(0));

    return minutes + ' minutes and ' + (seconds < 10 ? '0' : '') + seconds + ' seconds';
}