import * as fs from "fs";
import { PoEItem } from "./PoEItem.js";

const { program } = await import("commander");

program
  .name("Vorici Parser")
  .description("Takes item data from PoE + ClipCube and outputs a CSV file")
  .argument("<input>", "Input file")
  .option("-o, --output <output>", "Output file")
  .parse();

const input = program.args[0];
const output = program.opts().output ?? "poedata.csv";

if (!input) {
  console.error("No input file specified");
  process.exit(1);
}

if (!fs.existsSync(input)) {
  console.error("Input file does not exist");
  process.exit(1);
}

const data = fs.readFileSync(input, "utf8");

// ClipCube entry separator
const itemTexts = data.split("--------------------------------");

// Parse each item
const items: PoEItem[] = [];
let lastItemText: string = null;
for (const itemText of itemTexts) {
    if (itemText.length < 50) {
      // This isn't event trying to be an item, ignore it.
      continue;
    }
    const item = PoEItem.parse(itemText);
    if (lastItemText != null && lastItemText.substring(20) == itemText.substring(20)) {
      console.log("duplicate item detected, skipping");
      continue;
    }
    lastItemText = itemText;
    if (item instanceof PoEItem) {
        items.push(item);
    } else {
        console.log(itemText);
        console.log(item);
    }
}

// Print CSV to output
let csv = "Red,Green,Blue,White,Str,Dex,Int,ilvl,Quality,FirstSocketWasRGB";
for (const item of items) {
    csv += `\n${item.red},${item.green},${item.blue},${item.white},${item.strReq},${item.dexReq},${item.intReq},${item.ilvl},${item.quality},${item.firstSocketWasRGB ? "1" : "0"}`;
}

fs.writeFileSync(output, csv);