export function formatDate(date: string | Date, fmt = 'yyyy-MM-dd HH:mm:ss') {
    if (!date) {
        return ''
    }
    if (typeof date === 'string') {
        date = date.replace('T', ' ').replace('Z', '')
        date = new Date(date.replace(/-/g, '/'))
    }
    if (typeof date === 'number') {
        date = new Date(date)
    }
    var o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours() % 12 === 0 ? 12 : date.getHours() % 12,
        'H+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds(),
        'q+': Math.floor((date.getMonth() + 3) / 3),
        S: date.getMilliseconds(),
    }
    var week = {
        '0': '\u65e5',
        '1': '\u4e00',
        '2': '\u4e8c',
        '3': '\u4e09',
        '4': '\u56db',
        '5': '\u4e94',
        '6': '\u516d',
    }
    let yResult = fmt.match(/(y+)/)
    if (yResult?.length) {
        fmt = fmt.replace(
            yResult[0],
            (date.getFullYear() + '').slice(4 - yResult[0].length)
        )
    }
    let eResult = fmt.match(/(E+)/)
    type weekNum = '0' | '1' | '2' | '3' | '4' | '5' | '6'
    if (eResult?.length) {
        fmt = fmt.replace(
            eResult[0],
            (eResult[0].length > 1
                ? eResult[0].length > 2
                    ? '\u661f\u671f'
                    : '\u5468'
                : '') + week[(date.getDay() + '') as weekNum]
        )
    }
    for (let k in o) {
        let result = fmt.match(new RegExp('(' + k + ')'))
        if (result?.length) {
            fmt = fmt.replace(
                result[0],
                result[0].length === 1
                    ? o[k as keyof typeof o] + ''
                    : ('00' + o[k as keyof typeof o] + '').slice(
                          ('' + o[k as keyof typeof o] + '').length
                      )
            )
        }
    }
    return fmt
}
