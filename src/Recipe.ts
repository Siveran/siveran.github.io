import { Colored } from "./Colored";

/**
 * Holds the information for a possible Vorici recipe.
 * @author Siveran
 */
export class Recipe extends Colored {
	public description: string;
	public cost: number;
	public nonwhite: number;
	public isLegacy: boolean;
	
	public constructor(red: number, green: number, blue: number, white: number, cost: number, nonwhite: number, isLegacy: boolean, description: string = null) {
		super(red, green, blue, white);
		this.cost = cost;
		this.nonwhite = nonwhite;
		this.isLegacy = isLegacy;
		if (description == null) {
			this.description = "Vorici " + (red > 0 ? red + "R" : "") +  (green > 0 ? green + "G" : "") + (blue > 0 ? blue + "B" : "");
		} else {
			this.description = description;
		}
	}
}