function whichPlatform() {
    var platform = process.platform
    switch (platform) {
        case "aix":
            return "IBM AIX"
        case "darwin":
            return "MacOS"
        case "freebsd":
            return "FreeBSD"
        case "linux":
            return "Linux"
        case "openbsd":
            return "OpenBSD"
        case "sunos":
            return "SunOS"
        case "win32":
            return "windows"
        default:
            return "unknown"
    }
}

export const platform = whichPlatform()