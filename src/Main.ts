import { Recipe } from "./Recipe";
import { Probability } from "./Probability";
import { Colored } from "./Colored";
import { Utils } from "./Utils";

/**
 * A chromatic calculator that includes omen of trichromatism and crafting bench recipes,
 * for Path of Exile: Curse of the Allflame.
 * @author Siveran
 */
class Main {
	static recipes: Recipe[];
	static sockField: HTMLTextAreaElement;
	static strField: HTMLTextAreaElement;
	static dexField: HTMLTextAreaElement;
	static intField: HTMLTextAreaElement;
	static redField: HTMLTextAreaElement;
	static greenField: HTMLTextAreaElement;
	static blueField: HTMLTextAreaElement;
	static table: HTMLTableSectionElement;
	static tableWhole: HTMLTableElement;
	static recycle: HTMLTableSectionElement;
	
	static main(): void {
		// All the ways to change the socket colors
		let recipes: Recipe[] = [];
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
		recipes.push(new Recipe(3, 0, 0, 120, 6));
		recipes.push(new Recipe(0, 3, 0, 120, 6));
		recipes.push(new Recipe(0, 0, 3, 120, 6));
		recipes.push(new Recipe(2, 1, 0, 100, 7));
		recipes.push(new Recipe(2, 0, 1, 100, 7));
		recipes.push(new Recipe(1, 2, 0, 100, 7));
		recipes.push(new Recipe(0, 2, 1, 100, 7));
		recipes.push(new Recipe(1, 0, 2, 100, 7));
		recipes.push(new Recipe(0, 1, 2, 100, 7));
		
		// All the input fields and the result table that the script touches
		Main.sockField = document.getElementById("sockets") as HTMLTextAreaElement;
		Main.strField = document.getElementById("str") as HTMLTextAreaElement;
		Main.dexField = document.getElementById("dex") as HTMLTextAreaElement;
		Main.intField = document.getElementById("int") as HTMLTextAreaElement;
		Main.redField = document.getElementById("red") as HTMLTextAreaElement;
		Main.greenField = document.getElementById("green") as HTMLTextAreaElement;
		Main.blueField = document.getElementById("blue") as HTMLTextAreaElement;
		Main.table = document.getElementById("resultbody") as HTMLTableSectionElement;
		Main.tableWhole = document.getElementById("result") as HTMLTableElement;
		
		// Fill in the table with sufficient blank fields
		var i: number = 0;
		var j: number;
		for (let r in recipes) {
			var tr: HTMLTableRowElement = document.createElement("tablerow") as HTMLTableRowElement;
			var td: HTMLTableCellElement;
			j = 6;
			while (j > 0) {
				td = document.createElement("tablecell") as HTMLTableCellElement;
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
			Main.table.appendChild(tr);
			++i;
		}
		
		// Attach an event listener
		let calcButton = document.getElementById("calcButton");
		if (calcButton != null) {
			calcButton.onclick = Main.calculate;
		}
	}
	
	public static flipTableStripes() : void {
		var i: number = 0;
		var tr: Element = Main.table.firstElementChild;
		while (tr != null) {
			++i;
			if (tr.firstElementChild != null && tr.firstElementChild.innerHTML != "") {
				tr = null;
			} else {
				tr = tr.nextElementSibling;
			}
		}
		tr = Main.table.firstElementChild;
		while (tr != null) {
			tr.classList.toggle("reverseStripe", i % 2 == 0);
			tr = tr.nextElementSibling;
		}
	}
	
	private static updateTable(probabilities: Array<Probability>) : void {
		var row: Element = Main.table.firstElementChild;
		if (row == null) {
			return;
		}
		
		// Find the index of the best option
		var mindex: number = 0;
		var min: number = 0;
		var i: number = 0;
		var j: number = 0;
		for (let p of probabilities) {
			if (p.favg > 0 && (min == 0 || min > p.favg )) {
				mindex = i;
				min = p.favg;
			}
			++i;
		}
		
		for (let p of probabilities) { // Fill in rows with the probability array
			i = 0;
			var td: Element = row.firstElementChild;
			while (td != null) {
				td.innerHTML = p.get(i);
				td = td.nextElementSibling;
				++i;
			}
			//row.style.visibility = "visible";
			(row as HTMLElement).style.display = "table-row";
			row.classList.toggle("best", mindex == j);
			row.classList.remove("reverseStripe");
			row = row.nextElementSibling as Element;
			++j;
		}
		while (row != null) { // Hide remaining rows
			//row.style.visibility = "collapse";
			var td: Element = row.firstElementChild;
			while (td != null) {
				td.innerHTML = "";
				td = td.nextElementSibling;
			}
			(row as HTMLElement).style.display = "none";
			row.classList.remove("best");
			row = row.nextElementSibling;
		}
		var th: Element = Main.tableWhole?.tHead?.firstElementChild?.firstElementChild;
		i = 0;
		while (th != null) {
			var s: string = "";
			switch (i) {
				case 0: s = "Craft Type";
				case 1: s = "Average Cost<br/><span class=\"tablesubtitle\">(in chromatics)</span>";
				case 2: s = "Success Chance";
				case 3: s = "Average Attempts<br/><span class=\"tablesubtitle\">(mean)</span>";
				case 4: s = "Cost per Try<br/><span class=\"tablesubtitle\">(in chromatics)</span>";
				case 5: s = "Std. Deviation<br/><span class=\"tablesubtitle\">(of attempts)</span>";
			}
			th.classList.remove("SortTable_sorted");
			th.classList.remove("SortTable_sorted_reverse");
			th.innerHTML = s;
			th = th.nextElementSibling;
			++i;
		}
		// I don't know why this has to be called twice in order to support reversal.
		SortTable.makeSortable(Main.tableWhole);
		SortTable.makeSortable(Main.tableWhole);
	}
	
	public static calculate(d: any = null) : void {
		var probs:Array<Probability> = new Array<Probability>();
		var error: boolean = false;
		
		// Read all the fields
		var socks: number = parseInt(Main.sockField.value);
		var str: number = parseInt(Main.strField.value);
		var dex: number = parseInt(Main.dexField.value);
		var int: number = parseInt(Main.intField.value);
		var red: number = parseInt(Main.redField.value);
		var green: number = parseInt(Main.greenField.value);
		var blue: number = parseInt(Main.blueField.value);
		
		if (str == null) str = 0;
		if (dex == null) dex = 0;
		if (int == null) int = 0;
		
		// Check validity, display error messages in silly ways
		if(socks == null) {
			socks = red + blue + green;
			Main.sockField.value = "" + socks;
		}
		if (socks <= 0 || socks > 6) {
			error = true;
			probs.push(new Probability("Error:", "Invalid", "number", "of", "sockets.", ":("));
		}
		if (str < 0 || dex < 0 || int < 0) {
			error = true;
			probs.push(new Probability("Error:", "Invalid", "item", "stat", "requirements.", ":("));
		}
		if (str == 0 && dex == 0 && int == 0) {
			error = true;
			probs.push(new Probability("Error:", "Please", "fill in", "stat", "requirements.", ":("));
		}
		if (red < 0 || green < 0 || blue < 0 || red + blue + green == 0 || red > 6 || green > 6 || blue > 6 || red + blue + green > socks) {
			error = true;
			probs.push(new Probability("Error:", "Invalid", "desired", "socket", "colors.", ":("));
		}
		
		// No problems! Move along and do the real work.
		if (!error) {
			var requirements = new Colored(str, dex, int);
			var desiredSockets = new Colored(red, green, blue);
			probs = Main.getProbabilities(requirements, desiredSockets, socks);
		}
		
		// Push results to HTML
		Main.updateTable(probs);
	}
	
	// Get the chances for colors based on requirements
	private static getColorChances(requirements: Colored): Colored {
		// Constants! These are the hardest 3 numbers to find.
		var X: number = 5; // The X in [(Requirement + X + C) / (Requirement + 3X + C)] for on-color mono-requirement chances
		var C: number = 5; // The C in the above. Off-colors don't get the +C in the numerator, but do get X.
		var maxOnColorChance: number = 0.9; // What the on-color chance appears to approach with extremely high requirements.
		
		var totalRequirements: number = requirements.total();
		var numberOfRequirements = requirements.countNonZero();
		var requirementToChance: (req: number) => number;
		
		// Use a different formula based on how many requirements there are
		switch (numberOfRequirements) {
		case 1: // Single requirement items, like prophecy wands and vaal regalia
			requirementToChance = (requirement: number): number => { 
				if (requirement > 0) {
					// The real meat.
					// The chance for rolling an on-color socket for a mono-requirement item is
					//    X + C + requirement
					//   --------------------- * maxOnColorChance
					//    3X + C + totalReqs
					// In other words, the on-color chance approaches maxOnColorChance as requirement approaches infinity.
					return maxOnColorChance * (X + C + requirement) / (totalRequirements + 3 * X + C);
				} else {
					// The off-color chance is the remaining chance divided by 2.
					return ((1 - maxOnColorChance) / 2) + maxOnColorChance * (X / (totalRequirements + 3 * X + C));
				}
			};
		case 2: // Dual requirement items, like daggers and carnal armour
			requirementToChance = (requirement: number): number => {
				if (requirement > 0) {
					// If on-color, split the maxOnColorChance, weighted based on the requirements.
					return maxOnColorChance * requirement / totalRequirements;
				} else {
					// If off-color, it gets the whole off-color chance
					return 1 - maxOnColorChance;
				}
			};
		case 3: // Tri-requirement items, like Atziri's Splendour
			requirementToChance = (requirement: number): number => { 
				// For all current things that have equal requirements, it should be 1/3 chance per color.
				// There's no way to test how a 50 str/25 dex/100 int item behaves, so it's just, like, a guess.
				return requirement / totalRequirements;
			};
		}
		
		// Run the on the requirements to get the actual chances
		return requirements.map(requirementToChance);
	}
	
	// Get the probabilities for each recipe
	private static getProbabilities(requirements: Colored, desired: Colored, totalSockets: number) : Array<Probability> {
		var probs = new Array<Probability>();
		var colorChances = Main.getColorChances(requirements);
		Main.simulateLotsOfChromatics(colorChances, totalSockets);
		
		// For every recipe
		for (let recipe of Main.recipes) {
			// Recipe sanity check (you won't use 3R when you want BBBBBB)
			if (recipe.red <= desired.red && recipe.green <= desired.green && recipe.blue <= desired.blue) {
				// Subtract the forced sockets out; we don't need to consider them.
				// Unvoricified Desires are the sockets that haven't been guaranteed by the recipe that we still care about.
				var unvoricifiedDesires = new Colored(desired.red - recipe.red, desired.green - recipe.green, desired.blue - recipe.blue);
				var howManySocketsDoWeNotCareAbout: number = totalSockets - desired.total();
				
				// BRUTE FORCE
				var chance = Main.multinomial(colorChances, unvoricifiedDesires, howManySocketsDoWeNotCareAbout);
				if (recipe.description == "Chromatic") {
					// CHROMATIC BONUS ROUND
					var chanceForChromaticCollision = Main.calcChromaticBonus(colorChances, desired, totalSockets);
					chance /= 1 - chanceForChromaticCollision;
				}
				
				probs.push(new Probability(recipe.description,
					recipe.description == "Drop Rate" ? "-" : Utils.floatToPrecisionString(recipe.cost / chance, 1)/* + " <img src=\"chromsmall.png\"\\>"*/,
					Utils.floatToPercent(chance),
					Utils.floatToPrecisionString(1 / chance, 1),
					recipe.description == "Drop Rate" ? "-" : "" + recipe.cost/* + " <img src=\"chromsmall.png\"\\>"*/,
					Utils.floatToPrecisionString(Math.sqrt(Utils.clamp((1 - chance), 0, 1) / (chance * chance)), 2),
					recipe.cost/chance));
			}
		}
		
		return probs;
	}
	
	private static simulateLotsOfChromatics(colorChances: Colored, totalSockets: number) {
		var lastSockets = "";
		var sockets = new Colored(0, 0, 0);
		var total = new Colored(0, 0, 0);
		var i = 0;
		while (i < 100000) {
			// Roll each socket
			var j = 0;
			var currentSockets = "";
			sockets.set(0, 0, 0);
			while (j < totalSockets) {
				// Roll a socket
				var r = Math.random();
				if (r < colorChances.red) {
					currentSockets += "R";
					sockets.red++;
				} else if (r < colorChances.green + colorChances.red) {
					currentSockets += "G";
					sockets.green++;
				} else {
					currentSockets += "B";
					sockets.blue++;
				}
				j++;
			}
			
			// If that was what we got last time...
			if (currentSockets == lastSockets) {
				continue; // Roll again.
			}
			
			// Otherwise sum it up
			total.add(sockets);
			lastSockets = currentSockets;
			i++;
		}
		//trace(total.toString());
	}
	
	// Determines the chance of getting what you want based on the individual color chances.
	// Brute force a cumulative probability mass thing for a multinomial distribution.
	// I do this because there's a simple PMF for specific ordered results, but we want a range of results,
	// because we really don't care about some sockets. RRRB, RRRG, RRRR are all valid if you want RRR.
	// But not caring is hard. BRUTE HARD.
	private static multinomial(colorChances: Colored, desired: Colored, free: number, pos: number = 1) : number {
		if (free > 0) {
			// tell a genie to do it
			// pos is the position in the recursive tree and keeps track of history.
			// It prevents us from calculating the unordered chance for RGGB and RGBG and adding them, for example.
			return (pos <= 1 ? Main.multinomial(colorChances, new Colored(desired.red + 1, desired.green, desired.blue), free - 1, 1) : 0) +
				(pos <= 2 ? Main.multinomial(colorChances, new Colored(desired.red, desired.green + 1, desired.blue), free - 1, 2) : 0) +
				Main.multinomial(colorChances, new Colored(desired.red, desired.green, desired.blue + 1), free - 1, 3);
		} else {
			// oh i'm the genie
			return (Utils.factorial(desired.total()) / (Utils.factorial(desired.red) * Utils.factorial(desired.green) * Utils.factorial(desired.blue)))
				* Math.pow(colorChances.red, desired.red) * Math.pow(colorChances.green, desired.green) * Math.pow(colorChances.blue, desired.blue);
		}
	}
	
	// Because chromatic orbs can't get the same result multiple times in a row, we find the average repeat chance.
	private static calcChromaticBonus(colorChances: Colored, desired: Colored, free: number, rolled: Colored = null, pos: number = 1) : number {
		if (rolled == null) {
			rolled = new Colored(0, 0, 0);
		}
		
		if (rolled.red >= desired.red && rolled.green >= desired.green && rolled.blue >= desired.blue) {
			return 0; // We do this because you (hopefully) don't reroll it again if you have the desired colors, so there's no chromatic bonus from successes.
		} else if (free > 0) {
			// tell a genie to do it
			return (pos <= 1 ? Main.calcChromaticBonus(colorChances, desired, free - 1, new Colored(rolled.red + 1, rolled.green, rolled.blue), 1) : 0) +
				(pos <= 2 ? Main.calcChromaticBonus(colorChances, desired, free - 1, new Colored(rolled.red, rolled.green + 1, rolled.blue), 2) : 0) +
				Main.calcChromaticBonus(colorChances, desired, free - 1, new Colored(rolled.red, rolled.green, rolled.blue + 1), 3);
		} else {
			// oh i'm the genie
			return (Utils.factorial(rolled.total()) / (Utils.factorial(rolled.red) * Utils.factorial(rolled.green) * Utils.factorial(rolled.blue)))
				* Math.pow(colorChances.red, rolled.red * 2) * Math.pow(colorChances.green, rolled.green * 2) * Math.pow(colorChances.blue, rolled.blue * 2);
			// Note: the *2 in the exponents of the above are because we have to roll a permutation twice in a row before chromatic rerolls happen.
		}
	}
}
