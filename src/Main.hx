package ;

import js.Browser;
import js.html.Element;
import js.html.EventListener;
import js.html.HtmlElement;
import js.html.Node;
import js.html.TableCellElement;
import js.html.TableElement;
import js.html.TableRowElement;
import js.html.TableSectionElement;
import js.html.TextAreaElement;
import js.Lib;

/**
 * A chromatic calculator that includes partial coloring and Vorici recipes,
 * for Path of Exile: Forsaken Masters.
 * @author Siveran
 */

@:expose
class Main {
	static inline var X:Int = 12;
	static var recipes:Array<Recipe>;
	static var sockField:TextAreaElement;
	static var strField:TextAreaElement;
	static var dexField:TextAreaElement;
	static var intField:TextAreaElement;
	static var redField:TextAreaElement;
	static var greenField:TextAreaElement;
	static var blueField:TextAreaElement;
	static var table:TableSectionElement;
	static var tableWhole:TableElement;
	static var recycle:TableSectionElement;
	
	static function main() : Void {
		// All the vorici recipes, plus a regular chrome
		recipes = new Array<Recipe>();
		recipes.push(new Recipe(0, 0, 0, 1, 0, "Drop Rate"));
		recipes.push(new Recipe(0, 0, 0, 1, 0, "Chromatic"));
		recipes.push(new Recipe(1, 0, 0, 4, 2));
		recipes.push(new Recipe(0, 1, 0, 4, 2));
		recipes.push(new Recipe(0, 0, 1, 4, 2));
		recipes.push(new Recipe(2, 0, 0, 25, 3));
		recipes.push(new Recipe(0, 2, 0, 25, 3));
		recipes.push(new Recipe(0, 0, 2, 25, 3));
		recipes.push(new Recipe(0, 1, 1, 15, 4));
		recipes.push(new Recipe(1, 0, 1, 15, 4));
		recipes.push(new Recipe(1, 1, 0, 15, 4));
		recipes.push(new Recipe(3, 0, 0, 285, 6));
		recipes.push(new Recipe(0, 3, 0, 285, 6));
		recipes.push(new Recipe(0, 0, 3, 285, 6));
		recipes.push(new Recipe(2, 1, 0, 100, 7));
		recipes.push(new Recipe(2, 0, 1, 100, 7));
		recipes.push(new Recipe(1, 2, 0, 100, 7));
		recipes.push(new Recipe(0, 2, 1, 100, 7));
		recipes.push(new Recipe(1, 0, 2, 100, 7));
		recipes.push(new Recipe(0, 1, 2, 100, 7));
		
		// All the input fields and the result table that the script touches
		sockField = cast Browser.document.getElementById("sockets");
		strField = cast Browser.document.getElementById("str");
		dexField = cast Browser.document.getElementById("dex");
		intField = cast Browser.document.getElementById("int");
		redField = cast Browser.document.getElementById("red");
		greenField = cast Browser.document.getElementById("green");
		blueField = cast Browser.document.getElementById("blue");
		table = cast Browser.document.getElementById("resultbody");
		tableWhole = cast Browser.document.getElementById("result");
		
		// Fill in the table with sufficient blank fields
		var i:Int = 0;
		var j:Int;
		for (r in recipes) {
			var tr:TableRowElement = Browser.document.createTableRowElement();
			var td:TableCellElement;
			j = 6;
			while (j > 0) {
				td = Browser.document.createTableCellElement();
				if (i < 4) {
					td.innerHTML = "-";
				}
				tr.appendChild(td);
				--j;
			}
			//tr.style.visibility = "collapse";
			if (i >= 4) {
				tr.style.display = "none";
			}
			tr.classList.add("prob");
			table.appendChild(tr);
			++i;
		}
		
		// Attach an event listener
		Browser.document.getElementById("calcButton").onclick = calculate;
	}
	
	public static function flipTableStripes() : Void {
		var i:Int = 0;
		var tr:Element = table.firstElementChild;
		while (tr != null) {
			++i;
			if (tr.firstElementChild.innerHTML != "") {
				tr = null;
			} else {
				tr = tr.nextElementSibling;
			}
		}
		trace(i);
		tr = table.firstElementChild;
		while (tr != null) {
			tr.classList.toggle("reverseStripe", i % 2 == 0);
			tr = tr.nextElementSibling;
		}
	}
	
	private static function updateTable(probs:Array<Probability>) : Void {
		var row:Element = table.firstElementChild;
		
		// Find the index of the best option
		var mindex:Int = 0;
		var min:Float = 0;
		var i:Int = 0;
		var j:Int = 0;
		for (p in probs) {
			if (p.favg > 0 && (min == 0 || min > p.favg )) {
				mindex = i;
				min = p.favg;
			}
			++i;
		}
		
		for (p in probs) { // Fill in rows with the probability array
			i = 0;
			var td:Element = row.firstElementChild;
			while (td != null) {
				td.innerHTML = p.get(i);
				td = td.nextElementSibling;
				++i;
			}
			//row.style.visibility = "visible";
			row.style.display = "table-row";
			row.classList.toggle("best", mindex == j);
			row.classList.remove("reverseStripe");
			row = row.nextElementSibling;
			++j;
		}
		while (row != null) { // Hide remaining rows
			//row.style.visibility = "collapse";
			var td:Element = row.firstElementChild;
			while (td != null) {
				td.innerHTML = "";
				td = td.nextElementSibling;
			}
			row.style.display = "none";
			row.classList.remove("best");
			row = row.nextElementSibling;
		}
		var th:Element = tableWhole.tHead.firstElementChild.firstElementChild;
		i = 0;
		while (th != null) {
			var s:String = "";
			switch (i) {
				case 0: s = "Craft Type";
				case 1: s = "Success Chance";
				case 2: s = "Average Attempts<br/><span class=\"tablesubtitle\">(mean)</span>";
				case 3: s = "Cost per Try<br/><span class=\"tablesubtitle\">(in chromatics)</span>";
				case 4: s = "Average Cost<br/><span class=\"tablesubtitle\">(in chromatics)</span>";
				case 5: s = "Std. Deviation<br/><span class=\"tablesubtitle\">(of attempts)</span>";
			}
			th.classList.remove("SortTable_sorted");
			th.classList.remove("SortTable_sorted_reverse");
			th.innerHTML = s;
			th = th.nextElementSibling;
			++i;
		}
		// I don't know why this has to be called twice in order to support reversal.
		SortTable.makeSortable(tableWhole);
		SortTable.makeSortable(tableWhole);
	}
	
	public static function calculate(d:Dynamic = null) : Void {
		trace("Hello!");
		var probs:Array<Probability> = new Array<Probability>();
		var error:Bool = false;
		
		// Read all the fields
		var socks:Int = Std.parseInt(sockField.value);
		var str:Int = Std.parseInt(strField.value);
		var dex:Int = Std.parseInt(dexField.value);
		var int:Int = Std.parseInt(intField.value);
		var red:Int = Std.parseInt(redField.value);
		var green:Int = Std.parseInt(greenField.value);
		var blue:Int = Std.parseInt(blueField.value);
		
		// Check validity, display error messages in silly ways
		if (socks <= 0 || socks > 6) {
			error = true;
			probs.push(new Probability("Error:", "Invalid", "number", "of", "sockets.", ":("));
		}
		if (str < 0 || dex < 0 || int < 0) {
			error = true;
			probs.push(new Probability("Error:", "Invalid", "item", "stat", "requirements.", ":("));
		}
		if (red < 0 || green < 0 || blue < 0 || red + blue + green == 0 || red > 6 || green > 6 || blue > 6 || red + blue + green > socks) {
			error = true;
			probs.push(new Probability("Error:", "Invalid", "desired", "socket", "colors.", ":("));
		}
		if (!error) {
			probs = getProbabilities(str, dex, int, socks, red, green, blue);
		}
		
		// Push results to HTML
		updateTable(probs);
	}
	
	private static function getProbabilities(str:Int, dex:Int, int:Int, sockets:Int, dred:Int, dgreen:Int, dblue:Int) : Array<Probability> {
		var probs = new Array<Probability>();
		var div:Int = str + dex + int + 3 * X;
		
		// Sanity check; only use Vorici crafts that are directly in line with what you want.
		if (sockets > 6 || dred > 6 || dgreen > 6 || dblue > 6 ||
			sockets <= 0 || dred < 0 || dgreen < 0 || dblue < 0) {
			probs.push(new Probability("Sorry,", "that's", "definitely", "not", "happening.", ":I"));
			return probs;
		}
		
		// For every Vorici recipe (plus just chroming yourself)
		for (r in recipes) {
			// Recipe sanity check (you won't use 3R when you want BBBBBB)
			if (r.red <= dred && r.green <= dgreen && r.blue <= dblue) {
				// Subtract the forced sockets out; we don't need to consider them
				var red = dred - r.red;
				var green = dgreen - r.green;
				var blue = dblue - r.blue;
				var socks:Int = sockets - (r.red + r.green + r.blue);
				
				var chance:Float;
				// BRUTE FORCE
				rc = (X + str) / div;
				gc = (X + dex) / div;
				bc = (X + int) / div;
				chance = multinomial(red, green, blue, socks - red - green - blue);
				if (r.description == "Chromatic") {
					// CHROMATIC BONUS ROUND
					var cb = calcChromaticBonus(socks, red, green, blue);
					trace(cb);
					chance /= 1 - cb;
				}
				//probs.push(new Probability(r.description, Utils.floatToPercent(chance), Std.string(r.cost), Utils.floatToPrecisionString(r.cost / chance, 1), Std.string(r.level)));
				probs.push(new Probability(r.description,
					Utils.floatToPercent(chance),
					Utils.floatToPrecisionString(1 / chance, 1),
					r.description == "Drop Rate" ? "-" : Std.string(r.cost)/* + " <img src=\"chromsmall.png\"\\>"*/,
					r.description == "Drop Rate" ? "-" : Utils.floatToPrecisionString(r.cost / chance, 1)/* + " <img src=\"chromsmall.png\"\\>"*/,
					Utils.floatToPrecisionString(Math.sqrt((1 - chance) / (chance * chance)), 2),
					r.cost/chance)); 
			}
		}
		
		return probs;
	}
	
	// Color chances. Held in static memory rather than being passed recursiively,
	// because these values don't change and I don't want to fill the stack THAT fast.
	// They're set in getProbabilities().
	static var rc:Float;
	static var gc:Float;
	static var bc:Float;
	
	// Brute force a cumulative probability mass function thing for a multinomial distribution.
	// I do this because there's a simple PMF for specific ordered results, but we want a range of results,
	// because we really don't care about some sockets. RRRB, RRRG, RRRR are all valid if you want RRR.
	// But not caring is hard. BRUTE HARD.
	private static function multinomial(red:Int, green:Int, blue:Int, free:Int, pos:Int = 1) : Float {
		if (free > 0) {
			// GENIES TAKE THE WHEEL
			return (pos <= 1 ? multinomial(red + 1, green, blue, free - 1, 1) : 0) +
				(pos <= 2 ? multinomial(red, green + 1, blue, free - 1, 2) : 0) +
				multinomial(red, green, blue + 1, free - 1, 3);
		} else {
			// oh i'm the genie
			return (Utils.factorial(red + green + blue) / (Utils.factorial(red) * Utils.factorial(green) * Utils.factorial(blue)))
				* Math.pow(rc, red) * Math.pow(gc, green) * Math.pow(bc, blue);
		}
	}
	
	// Because chromatic orbs can't get the same result multiple times in a row, we find the average reroll chance.
	private static function calcChromaticBonus(free:Int, dred:Int, dgreen:Int, dblue:Int, red:Int = 0, green:Int = 0, blue:Int = 0, pos:Int = 1) : Float {
		if (red >= dred && green >= dgreen && blue >= dblue) {
			return 0; // We do this because you (hopefully) don't reroll it again if you have the desired colors, so there's no chromatic bonus from successes.
		} else if (free > 0) {
			// GENIES TAKE THE WHEEL
			return (pos <= 1 ? calcChromaticBonus(free - 1, dred, dgreen, dblue, red + 1, green, blue, 1) : 0) +
				(pos <= 2 ? calcChromaticBonus(free - 1, dred, dgreen, dblue, red, green + 1, blue, 2) : 0) +
				calcChromaticBonus(free - 1, dred, dgreen, dblue, red, green, blue + 1, 3);
		} else {
			// oh i'm the genie
			return (Utils.factorial(red + green + blue) / (Utils.factorial(red) * Utils.factorial(green) * Utils.factorial(blue)))
				* Math.pow(rc, red * 2) * Math.pow(gc, green * 2) * Math.pow(bc, blue * 2);
		}
	}
}