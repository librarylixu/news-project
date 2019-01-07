var rdpConfig = {
    port: 3389,
    mapClipboard: "on",
    sessionRecord: 1,
    server_bpp: 16,
    decompressingRDP61: "on",
    playSound: 0,
    /*
    playAudio=0
    soundPref=0: 声音质量低，占用很少带宽
    soundPref=1: 声音质量高，占用较多带宽
    */
    soundPref: 1,
    //整形，键盘布局代码，默认为 0x409 (美国)
    keyboard: 2052,
    width: 0,
    height: 0,
    fullBrowser: "Full%20browser",
    fullScreen: "Full%20screen",
    /*
        时区
        timezone= encodeURIComponent (‘(GMT-07:00)Mountain Standard Time’)
    */
    timezone: "(GMT%2B08%3A00)%20W.%20Australia%20Standard%20Time",
    mapPrinter: "on",
    mapDisk: "on",
    startProgram: "noapp",
    clear: "Clear",
    delete: "Delete",
    save: "Save",
    connect: "Connect"
};
var vncConfig = {
    port: 5900,
    mapClipboard: true,
    sessionRecord: 1,
    encoding: "ZRLE",
    quality: 5,
    compression: 6,
    UseCopyRect: true,
    color: 16,
    share: true,
    touchpad: false,
    trackCursorLocally: true,
    ignoreCursor: true,
    recording: false,
    repeaterPort: "5901",
    clear: "Clear",
    save: "Save",
    connect: "Connect"
};
var sshConfig = {
    port: 22,
    mapClipboard: "on",
    fontSize: 13,
    terminalType: "xterm",
    clear: "Clear",
    width: 0,
    height: 0,
    save: "Save",
    connect: "Connect",
    mapDisk: "off"
};
var telnetConfig = {
    port: 23,
    mapClipboard: "on",
    fontSize: 13,
    clear: "Clear",
    save: "Save",
    connect: "Connect"
};
var kvmConfig = {
    kvmStartType: 0
};

