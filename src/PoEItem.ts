export class PoEItem {
    public strReq: number;
    public dexReq: number;
    public intReq: number;
    public ilvl: number;
    public quality: number;
    public sockets: number;
    public red: number;
    public green: number;
    public blue: number;
    public white: number;
    
    constructor(strReq: number, dexReq: number, intReq: number, ilvl: number, quality: number, sockets: number, red: number, green: number, blue: number, white: number) {
        this.strReq = strReq;
        this.dexReq = dexReq;
        this.intReq = intReq;
        this.ilvl = ilvl;
        this.quality = quality;
        this.sockets = sockets;
        this.red = red;
        this.green = green;
        this.blue = blue;
        this.white = white;
    }

    static parse(text: string): PoEItem | string {
        let strReq: number = 0;
        let dexReq: number = 0;
        let intReq: number = 0;
        let ilvl: number = 0;
        let quality: number = 0;
        let sockets: number = 0;
        let red: number = 0;
        let green: number = 0;
        let blue: number = 0;
        let white: number = 0;

        // Item Level & Quality (currently unused, add post-3.29)
        var ilvlMatch: RegExpMatchArray = /Item Level:\s*(\d+)/g.exec(text);
        if (ilvlMatch != null) {
            ilvl = parseInt(ilvlMatch[1]);
        } else {
            // ALL items have an item level. Abort!
            if (text.length < 3) {
                // Ignore it; they were typing in the field.
            } else if (/░░░░░░░░░░░░░░/.exec(text)) {
                return "le";
            } else {
                return "Invalid item data. Ctrl+C while hovering an item in game.";
            }
            
            return;
        }
        if (isNaN(ilvl) || ilvl < 1) {
            return "Invalid item data. Ctrl+C while hovering an item in game.";
        }
        
        // Sockets
        var socketInfo: RegExpMatchArray = /Sockets: ((?:[\s-]*(?:[A-Z]))*)\s*\n/g.exec(text);
        var socket: RegExpMatchArray;
        var gemSocketTypes = ["R", "G", "B", "W"];
        var singleSocketRegex = /[\s-]*([A-Z])/g;
        if (socketInfo != null) {
            while (socket = singleSocketRegex.exec(socketInfo[1])) {
                // Only count RGBW sockets. Don't count A (abyssal sockets) or any other fancy future non-gem sockets
                if (gemSocketTypes.includes(socket[1])) {
                    sockets++;
                    if (socket[1] == "R") {
                        red++;
                    } else if (socket[1] == "G") {
                        green++;
                    } else if (socket[1] == "B") {
                        blue++;
                    } else if (socket[1] == "W") {
                        white++;
                    }
                }
            }
        }
        if (sockets == 0) {
            return "The pasted item has no gem sockets...?";
        }

        var qualityMatch: RegExpMatchArray = /Quality:\s*\+(\d+)/g.exec(text);
        if (qualityMatch != null) {
            quality = parseInt(qualityMatch[1]);
            
            if (quality < 0 || isNaN(quality)) {
                return "Couldn't parse the item's quality.";
            }
        }

        // Requirements
        var reqs: RegExpMatchArray = /Requirements:\s*(Level:\s*(\d+)\D*\n)?(Str:\s*(\d+)\D*\n)?(Dex:\s*(\d+)\D*\n)?(Int:\s*(\d+))?/g.exec(text);
        if (reqs != null) {
            strReq = parseInt(reqs[4] ?? "0");
            dexReq = parseInt(reqs[6] ?? "0");
            intReq = parseInt(reqs[8] ?? "0");
        } else {
            // Very low level bases have no requirements. Use 1.
            strReq = 1;
            dexReq = 1;
            intReq = 1;
        }

        return new PoEItem(strReq, dexReq, intReq, ilvl, quality, sockets, red, green, blue, white);
    }
}