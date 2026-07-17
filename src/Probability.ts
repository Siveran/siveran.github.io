/**
 * Holds the information of a crafting option.
 * @author Siveran
 */
export class Probability {
	public recipeName: string;
	public chance: string;
	public avgTries: string;
	public recipeCost: string;
	public avgCost: string;
	public stdDev: string;
	public favg: number;
	
	public constructor(recipeName: string, avgCost: string, chance: string, avgTries: string, recipeCost: string, stdDev: string, favg: number = 0) {
		this.recipeName = recipeName;
		this.avgCost = avgCost;
		this.chance = chance;
		this.avgTries = avgTries;
		this.recipeCost = recipeCost;
		this.stdDev = stdDev;
		this.favg = favg;
	}
	
	public get(part: number) : string {
		switch (part) {
			case 0: return this.recipeName;
			case 1: return "<span class=\"highlighted\">" + this.avgCost + "</b>";
			case 2: return this.chance;
			case 3: return this.avgTries;
			case 4: return this.recipeCost;
			case 5: return this.stdDev;
			default: return "N/A";
		}
	}
	
}