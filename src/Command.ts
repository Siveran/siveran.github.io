import * as fs from "fs";
import { program } from "commander";
import { PoEItem } from "./PoEItem";

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
const itemTexts = data.split("]------------------------------------------------------------");

// Parse each item
const items: PoEItem[] = [];
for (const itemText of itemTexts) {
    const item = PoEItem.parse(itemText);
    if (item instanceof PoEItem) {
        items.push(item);
    } else {
        console.log(item);
    }
}

// Print CSV to output
let csv = "Red,Green,Blue,White,Str,Dex,Int,Ilvl,Quality";
for (const item of items) {
    csv += `\n${item.red},${item.green},${item.blue},${item.white},${item.strReq},${item.dexReq},${item.intReq},${item.ilvl},${item.quality}`;
}

fs.writeFileSync(output, csv);