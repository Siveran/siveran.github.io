import { Colored } from "./Colored";

/**
 * Holds the information for a possible Vorici recipe.
 * @author Siveran
 */
export class Recipe extends Colored {
	public description: string;
	public cost: number;
	public level: number;
	
	public constructor(r: number, g: number, b: number, w: number, c: number, l: number, d: string | null = null) {
		super(r, g, b, w);
		this.cost = c;
		this.level = l;
		if (d == null) {
			this.description = "Vorici " + (r > 0 ? r + "R" : "") +  (g > 0 ? g + "G" : "") + (b > 0 ? b + "B" : "");
		} else {
			this.description = d;
		}
	}
}