import { Recipe } from "./Recipe";
import { Probability } from "./Probability";
import { Colored } from "./Colored";
import { Utils } from "./Utils";

/**
 * A chromatic calculator that includes omen of trichromatism and crafting bench recipes,
 * for Path of Exile: Curse of the Allflame.
 * @author Siveran
 */
export class Main {
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
	static whiteChanceField: HTMLTextAreaElement;
	static allflameField: HTMLInputElement;
	
	static main(): void {
		// All the ways to change the socket colors
		let recipes: Recipe[] = [];
		recipes.push(new Recipe(0, 0, 0, 0, 1, 0, true, "Drop Rate"));
		recipes.push(new Recipe(0, 0, 0, 0, 1, 1, false, "Chromatic"));
		recipes.push(new Recipe(1, 0, 0, 0, 4, 0, true));
		recipes.push(new Recipe(0, 1, 0, 0, 4, 0, true));
		recipes.push(new Recipe(0, 0, 1, 0, 4, 0, true));
		recipes.push(new Recipe(2, 0, 0, 0, 25, 0, true));
		recipes.push(new Recipe(0, 2, 0, 0, 25, 0, true));
		recipes.push(new Recipe(0, 0, 2, 0, 25, 0, true));
		recipes.push(new Recipe(0, 1, 1, 0, 15, 0, true));
		recipes.push(new Recipe(1, 0, 1, 0, 15, 0, true));
		recipes.push(new Recipe(1, 1, 0, 0, 15, 0, true));
		recipes.push(new Recipe(3, 0, 0, 0, 120, 0, true));
		recipes.push(new Recipe(0, 3, 0, 0, 120, 0, true));
		recipes.push(new Recipe(0, 0, 3, 0, 120, 0, true));
		recipes.push(new Recipe(2, 1, 0, 0, 100, 0, true));
		recipes.push(new Recipe(2, 0, 1, 0, 100, 0, true));
		recipes.push(new Recipe(1, 2, 0, 0, 100, 0, true));
		recipes.push(new Recipe(0, 2, 1, 0, 100, 0, true));
		recipes.push(new Recipe(1, 0, 2, 0, 100, 0, true));
		recipes.push(new Recipe(0, 1, 2, 0, 100, 0, true));
		recipes.push(new Recipe(1, 1, 1, 0, 20, 0, false, "Trichromatism"));
		recipes.push(new Recipe(0, 0, 0, 0, 5, 2, false, "2 Non-White"));
		recipes.push(new Recipe(0, 0, 0, 0, 20, 3, false, "3 Non-White"));
		recipes.push(new Recipe(0, 0, 0, 0, 75, 4, false, "4 Non-White"));
		Main.recipes = recipes;
		
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
		Main.whiteChanceField = document.getElementById("whiteChance") as HTMLTextAreaElement;
		Main.allflameField = document.getElementById("allflame") as HTMLInputElement;

		// Toggle Allflame on automatically if it's released
		if (Main.allflameField && Date.now() > Date.parse("2026-07-24T19:00:00.000Z")) {
			Main.allflameField.checked = true;
		}
		
		// Fill in the table with sufficient blank fields
		var i: number = 0;
		var j: number;
		for (let r in recipes) {
			var tr: HTMLTableRowElement = document.createElement("tr") as HTMLTableRowElement;
			var td: HTMLTableCellElement;
			j = 6;
			while (j > 0) {
				td = document.createElement("td") as HTMLTableCellElement;
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
			row = row.nextElementSibling;
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
				case 0: s = "Craft Type"; break;
				case 1: s = "Average Cost<br/><span class=\"tablesubtitle\">(in chromatics)</span>"; break;
				case 2: s = "Success Chance"; break;
				case 3: s = "Average Attempts<br/><span class=\"tablesubtitle\">(mean)</span>"; break;
				case 4: s = "Cost per Try<br/><span class=\"tablesubtitle\">(in chromatics)</span>"; break;
				case 5: s = "Std. Deviation<br/><span class=\"tablesubtitle\">(of attempts)</span>"; break;
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
		var probs: Array<Probability> = new Array<Probability>();
		var error: boolean = false;
		
		// Read all the fields
		var socks: number = parseInt(Main.sockField.value);
		var str: number = parseInt(Main.strField.value);
		var dex: number = parseInt(Main.dexField.value);
		var int: number = parseInt(Main.intField.value);
		var red: number = parseInt(Main.redField.value);
		var green: number = parseInt(Main.greenField.value);
		var blue: number = parseInt(Main.blueField.value);
		var whiteChance: number = parseFloat(Main.whiteChanceField.value);
		var allflame: boolean = Main.allflameField.checked;
		
		if (isNaN(socks) || socks < 0) socks = 0;
		if (isNaN(str) || str < 0) str = 0;
		if (isNaN(dex) || dex < 0) dex = 0;
		if (isNaN(int) || int < 0) int = 0;
		if (isNaN(red) || red < 0) red = 0;
		if (isNaN(green) || green < 0) green = 0;
		if (isNaN(blue) || blue < 0) blue = 0;
		if (!allflame || isNaN(whiteChance) || whiteChance < 0 || whiteChance >= 100) {
			whiteChance = 0;
		} else {
			whiteChance /= 100;
		}
		
		// Check validity, display error messages in silly ways
		if(socks == 0) {
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
			var requirements = new Colored(str, dex, int, 0);
			var desiredSockets = new Colored(red, green, blue, 0);
			probs = Main.getProbabilities(requirements, desiredSockets, socks, whiteChance, !allflame);

			if (Main.allflameField.onclick == null) {
				Main.allflameField.onclick = Main.calculate;
			}
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
			break;
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
			break;
		case 3: // Tri-requirement items, like Atziri's Splendour
			requirementToChance = (requirement: number): number => { 
				// For all current things that have equal requirements, it should be 1/3 chance per color.
				// There's no way to test how a 50 str/25 dex/100 int item behaves, so it's just, like, a guess.
				return requirement / totalRequirements;
			};
			break;
		}

		// Run the on the requirements to get the actual chances
		return new Colored(requirementToChance(requirements.red), requirementToChance(requirements.green), requirementToChance(requirements.blue), 0);
	}

	// New in 3.29: There's a high chance that sockets will be white.
	public static diluteChances(undilutedChances: Colored, whiteChance: number): Colored {
		var coloredChance = 1 - whiteChance;
		return new Colored(undilutedChances.red * coloredChance, undilutedChances.green * coloredChance, undilutedChances.blue * coloredChance, whiteChance);
	}
	
	// Get the probabilities for each recipe
	private static getProbabilities(requirements: Colored, desired: Colored, totalSockets: number, whiteChance: number, isLegacy: boolean) : Array<Probability> {
		var probs = new Array<Probability>();
		var rgbOnlyChances = Main.getColorChances(requirements);
		var fullChances = Main.diluteChances(rgbOnlyChances, whiteChance);
		//Main.simulateLotsOfChromatics(colorChances, totalSockets);
		
		// For every recipe
		for (let recipe of Main.recipes) {
			var versionMatch: boolean = (recipe.isLegacy == isLegacy) || recipe.description == "Chromatic" || recipe.description == "Drop Rate";
			if (!versionMatch) continue;

			// Recipe sanity check (you won't use 3R when you want BBBBBB)
			if ((recipe.nonwhite <= totalSockets
					&& recipe.red <= desired.red && recipe.green <= desired.green && recipe.blue <= desired.blue)
					|| (totalSockets >= 3 && recipe.description == "Trichromatism")) {
				// Subtract the forced sockets out; we don't need to consider them.
				// Unvoricified Desires are the sockets that haven't been guaranteed by the recipe that we still care about.
				var unvoricifiedDesires = desired.subtract(recipe).map((count) => Math.max(0, count));
				var howManySocketsWeDoNotCareAbout: number = totalSockets - desired.total();

				// For each color we guaranteed through Trichromatism that we didn't want, remove one from the flexible socket count.
				if (recipe.description == "Trichromatism") {
					if (desired.red == 0) howManySocketsWeDoNotCareAbout--;
					if (desired.green == 0) howManySocketsWeDoNotCareAbout--;
					if (desired.blue == 0) howManySocketsWeDoNotCareAbout--;
					if (howManySocketsWeDoNotCareAbout < 0) continue; // We can't use Trichromatism; there's not enough flexible sockets.
				}
				
				// BRUTE FORCE
				//var chance = Main.multinomial(colorChances, unvoricifiedDesires, howManySocketsDoWeNotCareAbout);
				console.log(fullChances, rgbOnlyChances, unvoricifiedDesires, howManySocketsWeDoNotCareAbout, recipe.nonwhite);
				var chance = Main.multinomial(fullChances, rgbOnlyChances, unvoricifiedDesires, howManySocketsWeDoNotCareAbout, 1, recipe.nonwhite);

				if (recipe.description == "Chromatic") {
					// CHROMATIC BONUS ROUND
					var chanceForChromaticCollision = Main.calcChromaticBonus(fullChances, rgbOnlyChances, new Colored(0, 0, 0, 0), totalSockets, 1, 1);
					console.log(chanceForChromaticCollision);
					console.log(chance);
					chance = 1 - ((1 - chance) * (1 - chanceForChromaticCollision));
				}
				
				// Is this recipe compatible with the version of the game we're trying to work with?
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
	
	// Test function to check to make sure chromatic bonuses are working correctly.
	private static simulateLotsOfChromatics(colorChances: Colored, totalSockets: number) {
		var lastSockets = "";
		var sockets = new Colored(0, 0, 0, 0);
		var total = new Colored(0, 0, 0, 0);
		var i = 0;
		var rerolls = 0;
		while (i < 100000) {
			// Roll each socket
			var j = 0;
			var currentSockets = "";
			sockets.set(0, 0, 0, 0);
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
				rerolls++;
				if (rerolls > 1000000) {
					break; // Infinite loop protection if someone is providing an unrealistically high single requirement and single socket item.
				}
				continue; // Roll again.
			}
			
			// Otherwise sum it up
			total = total.add(sockets);
			lastSockets = currentSockets;
			i++;
		}
		//trace(total.toString());
	}
	
	// Because chromatic orbs can't get the same result multiple times in a row, we find the average repeat chance.
	// TODO: This needs to be tested in 3.29. It might not apply, anymore!
	private static calcChromaticBonus(fullChances: Colored, rgbOnlyChances: Colored, target: Colored, free: number, freeBranch: number = 1, rgbOnly: number = 0, rgbOnlyBranch: number = 1, rgbOnlyTarget: Colored = new Colored(0, 0, 0, 0)) : number {
		if (free > 0) {
			// Tell a genie to do it
			return (freeBranch <= 1 ? Main.calcChromaticBonus(fullChances, rgbOnlyChances, new Colored(target.red + 1, target.green, target.blue, target.white), free - 1, 1, rgbOnly, 1, rgbOnlyTarget) : 0) +
				(freeBranch <= 2 ? Main.calcChromaticBonus(fullChances, rgbOnlyChances, new Colored(target.red, target.green + 1, target.blue, target.white), free - 1, 2, rgbOnly, 1, rgbOnlyTarget) : 0) +
				(freeBranch <= 3 ? Main.calcChromaticBonus(fullChances, rgbOnlyChances, new Colored(target.red, target.green, target.blue + 1, target.white), free - 1, 3, rgbOnly, 1, rgbOnlyTarget) : 0) +
				Main.calcChromaticBonus(fullChances, rgbOnlyChances, new Colored(target.red, target.green, target.blue, target.white + 1), free - 1, 4, rgbOnly);
		} else if (rgbOnly > 0) {
			// Try all possibilities of guaranteed colored socket assignments.
			// For example, if a 3S item has desired colors of 1R1B and you're using a chromatic orb, the guaranteed non-white might be assigned red, green, or blue.
			return (rgbOnlyBranch <= 1 && target.red > 0 ? Main.calcChromaticBonus(fullChances, rgbOnlyChances, new Colored(target.red - 1, target.green, target.blue, target.white), 0, 0, rgbOnly - 1, 1, new Colored(rgbOnlyTarget.red + 1, rgbOnlyTarget.green, rgbOnlyTarget.blue, rgbOnlyTarget.white)) : 0) +
				(rgbOnlyBranch <= 2 && target.green > 0 ? Main.calcChromaticBonus(fullChances, rgbOnlyChances, new Colored(target.red, target.green - 1, target.blue, target.white), 0, 0, rgbOnly - 1, 2, new Colored(rgbOnlyTarget.red, rgbOnlyTarget.green + 1, rgbOnlyTarget.blue, rgbOnlyTarget.white)) : 0) +
				(rgbOnlyBranch <= 3 && target.blue > 0 ? Main.calcChromaticBonus(fullChances, rgbOnlyChances, new Colored(target.red, target.green, target.blue - 1, target.white), 0, 0, rgbOnly - 1, 3, new Colored(rgbOnlyTarget.red, rgbOnlyTarget.green, rgbOnlyTarget.blue + 1, rgbOnlyTarget.white)) : 0);
		} else {
			// oh i'm the genie
			return (Utils.factorial(rgbOnlyTarget.total()) / (Utils.factorial(rgbOnlyTarget.red) * Utils.factorial(rgbOnlyTarget.green) * Utils.factorial(rgbOnlyTarget.blue)))
				* Math.pow(rgbOnlyChances.red, rgbOnlyTarget.red * 2) * Math.pow(rgbOnlyChances.green, rgbOnlyTarget.green * 2) * Math.pow(rgbOnlyChances.blue, rgbOnlyTarget.blue * 2)
				* (Utils.factorial(target.total() + rgbOnlyTarget.total()) / (Utils.factorial(target.red + rgbOnlyTarget.red) * Utils.factorial(target.green + rgbOnlyTarget.green) * Utils.factorial(target.blue + rgbOnlyTarget.blue) * Utils.factorial(target.white + rgbOnlyTarget.white)))
				* Math.pow(fullChances.red, target.red * 2) * Math.pow(fullChances.green, target.green * 2) * Math.pow(fullChances.blue, target.blue * 2) * Math.pow(fullChances.white, target.white * 2)
				* (Utils.factorial(target.red + rgbOnlyTarget.red) * Utils.factorial(target.green + rgbOnlyTarget.green) * Utils.factorial(target.blue + rgbOnlyTarget.blue) * Utils.factorial(target.white + rgbOnlyTarget.white)) / (Utils.factorial(target.total() + rgbOnlyTarget.total()));
		}
	}

	// Determines the chance of getting what you want based on the individual color chances.
	// Brute force a cumulative probability mass thing for a multinomial distribution.
	// I do this because there's a simple PMF for specific ordered results, but we want a range of results,
	// because we really don't care about some sockets. RRRB, RRRG, RRRR, and RRRW are all valid if you want RRR.
	// Sum the chances of all of them
	private static multinomial(fullChances: Colored, rgbOnlyChances: Colored, target: Colored, free: number, freeBranch: number = 1, rgbOnly: number = 0, rgbOnlyBranch: number = 1, rgbOnlyTarget: Colored = new Colored(0, 0, 0, 0)) : number {
		if (free > 0) {
			// Try all possibilities of FINAL socket colors that include the desired socket colors.
			// For example, if a 3S item has desired colors of 1R1B, allow 1R2B, 2R1B, 1R1B1W, and 1R1B1G.
			// pos is the position in the recursive tree and keeps track of history.
			// It prevents us from calculating the unordered chance for RGGB and RGBG and adding them, for example.
			return (freeBranch <= 1 ? Main.multinomial(fullChances, rgbOnlyChances, new Colored(target.red + 1, target.green, target.blue, target.white), free - 1, 1, rgbOnly, 1, rgbOnlyTarget) : 0) +
				(freeBranch <= 2 ? Main.multinomial(fullChances, rgbOnlyChances, new Colored(target.red, target.green + 1, target.blue, target.white), free - 1, 2, rgbOnly, 1, rgbOnlyTarget) : 0) +
				(freeBranch <= 3 ? Main.multinomial(fullChances, rgbOnlyChances, new Colored(target.red, target.green, target.blue + 1, target.white), free - 1, 3, rgbOnly, 1, rgbOnlyTarget) : 0) +
				Main.multinomial(fullChances, rgbOnlyChances, new Colored(target.red, target.green, target.blue, target.white + 1), free - 1, 4, rgbOnly, 1, rgbOnlyTarget);
		} else if (rgbOnly > 0) {
			// Try all possibilities of guaranteed colored socket assignments.
			// For example, if a 3S item has desired colors of 1R1B and you're using a chromatic orb, the guaranteed non-white might be assigned red, green, or blue.
			return (rgbOnlyBranch <= 1 && target.red > 0 ? Main.multinomial(fullChances, rgbOnlyChances, new Colored(target.red - 1, target.green, target.blue, target.white), free, 0, rgbOnly - 1, 1, new Colored(rgbOnlyTarget.red + 1, rgbOnlyTarget.green, rgbOnlyTarget.blue, 0)) : 0) +
				(rgbOnlyBranch <= 2 && target.green > 0 ? Main.multinomial(fullChances, rgbOnlyChances, new Colored(target.red, target.green - 1, target.blue, target.white), free, 0, rgbOnly - 1, 2, new Colored(rgbOnlyTarget.red, rgbOnlyTarget.green + 1, rgbOnlyTarget.blue, 0)) : 0) +
				(rgbOnlyBranch <= 3 && target.blue > 0 ? Main.multinomial(fullChances, rgbOnlyChances, new Colored(target.red, target.green, target.blue - 1, target.white), free, 0, rgbOnly - 1, 3, new Colored(rgbOnlyTarget.red, rgbOnlyTarget.green, rgbOnlyTarget.blue + 1, 0)) : 0);
		} else {
				// Get the DISTINCT ways to generate RGB-only sockets.
				// If you have two RGB-only sockets and R/G have equal chances, you're equally likely to get RG, GR, and RR. That means you're twice as likely to get 1R1G than 2R.
				var repeatsPerRgbOnlyShuffle = Utils.factorial(rgbOnlyTarget.red)
											 * Utils.factorial(rgbOnlyTarget.green)
											 * Utils.factorial(rgbOnlyTarget.blue);
				var rgbOnlyDistinctShuffles = Utils.factorial(rgbOnlyTarget.total()) / repeatsPerRgbOnlyShuffle;

				// Get the DISTINCT ways to generate non-RGB-only sockets. For example, a 4 socket item drop has 24 ways to shuffle the sockets, but RRRG only has 4 distinct shuffles (GRRR, RGRR, RRGR, RRRG).
				var shuffles = Utils.factorial(target.total());
				var repeatsPerShuffle = Utils.factorial(target.red)
									  * Utils.factorial(target.green)
									  * Utils.factorial(target.blue)
									  * Utils.factorial(target.white);
				var distinctShuffles = shuffles / repeatsPerShuffle;

				// The chance of rolling a specific set of full-odds sockets
				var normalSocketsChance = Math.pow(fullChances.red, target.red)
										* Math.pow(fullChances.green, target.green)
										* Math.pow(fullChances.blue, target.blue)
										* Math.pow(fullChances.white, target.white);
							
				// Chance of rolling a specific set of RGB-only sockets (e.g. GR)
				var rgbOnlyChance = Math.pow(rgbOnlyChances.red, rgbOnlyTarget.red)
								  * Math.pow(rgbOnlyChances.green, rgbOnlyTarget.green)
								  * Math.pow(rgbOnlyChances.blue, rgbOnlyTarget.blue);

				console.log(target, rgbOnlyTarget, rgbOnlyDistinctShuffles, distinctShuffles, normalSocketsChance, rgbOnlyChance);
				return rgbOnlyDistinctShuffles * distinctShuffles * normalSocketsChance * rgbOnlyChance;
		}
	}

	// TODO: Need to test whether the crafting bench recipe non-white guarantees happen *before* or *after* rolling all the sockets.
	// If it happens before, then the current implementation of nonWhiteGuaranteedMultinomial() is correct (I think).
	// Otherwise, we need to add one more layer of chances. For example, in the latter case, if 4 non-white is a 2% chance, if we NATURALLY rolled a 4 non-white, then the guarantee doesn't matter.
	// The 4-socket guarantee wouldn't improve our chances of getting 5 or 6 non-whites at all over a chromatic orb.
	// That would be incredibly stupid, so hopefully that's not how it works!
}

if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", Main.main);
} else {
	Main.main();
}