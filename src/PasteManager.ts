import { Main } from "./Main.js";
import { PoEItem } from "./PoEItem.js";
import { Probability } from "./Probability.js";

export class PasteManager {
	pasteField: HTMLTextAreaElement;
	pasteClassTimeout: number;
	pasteClassTimeoutFunction: () => void;
    pasteTextTimeout: number;
    pasteTextTimeoutFunction: () => void;

    constructor() {
        this.pasteField = document.getElementById("paste") as HTMLTextAreaElement;

		if (this.pasteField != null) {
			this.pasteField.addEventListener("input", this.readPaste.bind(this));
            this.pasteField.focus();
		}
    }
    
    private flashPasteMessage(text: string, cssClass: string): void {
        // Undo the previous flashing message
        if (this.pasteClassTimeout != null) {
            clearTimeout(this.pasteClassTimeout);
            this.pasteClassTimeoutFunction();
        }
        if (this.pasteTextTimeout != null) {
            clearTimeout(this.pasteTextTimeout);
            this.pasteTextTimeoutFunction();
        }

        this.pasteField.placeholder = text;
        if (cssClass != null) {
            this.pasteField.classList.add(cssClass);
        }

        this.pasteClassTimeoutFunction = () => {
            this.pasteField.classList.remove(cssClass);
            this.pasteClassTimeout = null;
            this.pasteClassTimeoutFunction = null;
        }

        this.pasteTextTimeoutFunction = () => {
            this.pasteField.placeholder = "Paste item data here";
            this.pasteTextTimeout = null;
            this.pasteTextTimeoutFunction = null;
        }

        this.pasteClassTimeout = window.setTimeout(this.pasteClassTimeoutFunction, 1000);
        this.pasteTextTimeout = window.setTimeout(this.pasteTextTimeoutFunction, 2000);
    }

    private readPaste(e: Event): void {
        var itemString: string = this.pasteField.value;
        this.pasteField.value = "";
        console.log(itemString);

        var item: PoEItem | string = PoEItem.parse(itemString);
        if (item instanceof PoEItem) {
            Main.sockField.value = "" + item.sockets;
            Main.strField.value = "" + item.strReq;
            Main.dexField.value = "" + item.dexReq;
            Main.intField.value = "" + item.intReq;
            Main.ilvlField.value = "" + item.ilvl;
            Main.qualityField.value = "" + item.quality;
            Main.redField.focus();
            this.flashPasteMessage("Item pasted!", "flashingSuccess");
        } else {
            if (item == "le") {
                Main.updateTable([Probability.error(atob('bGUgdG91Y2FuIGhhcyBhcnJpdmVkIDop'))])
            } else {
                this.flashPasteMessage(item, "flashingError");
            }
        }
        // Sockets
        var socketInfo: RegExpMatchArray = /Sockets: ((?:[\s-]*(?:[A-Z]))*)\s*\n/g.exec(itemString);
        var socket: RegExpMatchArray;
        var gemSocketTypes = ["R", "G", "B", "W"];
        var count = 0;
        var singleSocketRegex = /[\s-]*([A-Z])/g;
        if (socketInfo != null) {
            while (socket = singleSocketRegex.exec(socketInfo[1])) {
                // Only count RGBW sockets. Don't count A (abyssal sockets) or any other fancy future non-gem sockets
                if (gemSocketTypes.includes(socket[1])) {
                    count++;
                }
            }
        }

        // Item Level & Quality (currently unused, add post-3.29)
        var ilvl: RegExpMatchArray = /Item Level:\s*(\d+)/g.exec(itemString);
        if (ilvl != null) {
            console.log("ilvl: " + ilvl[1]);
        } else {
            // ALL items have an item level. Abort!
            if (itemString.length < 3) {
                // Ignore it; they were typing in the field.
            } else if (/░░░░░░░░░░░░░░/.exec(itemString)) {
                Main.updateTable([Probability.error(atob('bGUgdG91Y2FuIGhhcyBhcnJpdmVkIDop'))]);
            } else {
                this.flashPasteMessage("Invalid item data. Ctrl+C while hovering an item in game.", "flashingError");
            }
            
            return;
        }
        
        if (count == 0) {
            this.flashPasteMessage("The pasted item has no gem sockets...?", "flashingError");
            return;
        }
        Main.sockField.value = "" + count;

        var quality: RegExpMatchArray = /Quality:\s*\+(\d+)/g.exec(itemString);
        if (quality != null) {
            console.log("quality: " + quality[1]);
        }

        // Requirements
        var reqs: RegExpMatchArray = /Requirements:\s*(Level:\s*(\d+)\D*\n)?(Str:\s*(\d+)\D*\n)?(Dex:\s*(\d+)\D*\n)?(Int:\s*(\d+))?/g.exec(itemString);
        if (reqs != null) {
            Main.strField.value = reqs[4] ?? "";
            Main.dexField.value = reqs[6] ?? "";
            Main.intField.value = reqs[8] ?? "";
        } else {
            // Very low level bases have no requirements. Use 1.
            Main.strField.value = "1";
            Main.dexField.value = "1";
            Main.intField.value = "1";
        }

        this.flashPasteMessage("Item pasted!", "flashingSuccess");
        Main.redField.focus();
    }
}
