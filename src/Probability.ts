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
	public versionMatch: boolean;
	
	public constructor(recipeName: string, avgCost: string, chance: string, avgTries: string, recipeCost: string, stdDev: string, favg: number = 0, versionMatch: boolean = true) {
		this.recipeName = recipeName;
		this.avgCost = avgCost;
		this.chance = chance;
		this.avgTries = avgTries;
		this.recipeCost = recipeCost;
		this.stdDev = stdDev;
		this.favg = favg;
		this.versionMatch = versionMatch;
	}

	public static error(text: string): Probability {
		let parts = text.split(" ");
		return new Probability("Error:", parts[0], parts[1], parts[2], parts[3], parts[4]);
	}
	
	public get(part: number): string {
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