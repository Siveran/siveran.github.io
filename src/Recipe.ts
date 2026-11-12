import { Colored } from "./Colored.js";

/**
 * Holds the information for a possible Vorici recipe.
 * @author Siveran
 */
export class Recipe extends Colored {
	public description: string;
	public cost: number;
	public nonwhite: number;
	public isLegacy: boolean;
	public showCost: boolean;
	
	public constructor(red: number, green: number, blue: number, white: number, cost: number, nonwhite: number, isLegacy: boolean, description: string = null, showCost: boolean = true) {
		super(red, green, blue, white);
		this.cost = cost;
		this.nonwhite = nonwhite;
		this.isLegacy = isLegacy;
		if (description == null) {
			this.description = "Vorici " + (red > 0 ? red + "R" : "") +  (green > 0 ? green + "G" : "") + (blue > 0 ? blue + "B" : "");
		} else {
			this.description = description;
		}
		// Trichromatism and tainted chromatic orbs' costs are wildly rough estimates, so don't show an exact number for them.
		// The row will still be highlighted green if it's estimated to be the best value
		this.showCost =	showCost;
	}
}