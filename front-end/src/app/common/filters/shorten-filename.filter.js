export function ShortenFilenameFilter() {
    return (fileName, leaveNumber) => {
        if (!fileName) {
            return '';
        }
        let parsed = fileName.split("."),
            ext = parsed.pop();
        
        return parsed.join('.').substr(0, 20) + '...' + ext;
    };
}
