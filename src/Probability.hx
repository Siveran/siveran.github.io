package ;

/**
 * Holds the information of a crafting option.
 * @author Siveran
 */
class Probability {
	public var recipeName:String;
	public var chance:String;
	public var avgTries:String;
	public var recipeCost:String;
	public var avgCost:String;
	public var stdDev:String;
	public var favg:Float;
	
	public function new(recipeName:String, avgCost:String, chance:String, avgTries:String, recipeCost:String, stdDev:String, favg:Float = 0) {
		this.recipeName = recipeName;
		this.chance = chance;
		this.avgTries = avgTries;
		this.recipeCost = recipeCost;
		this.avgCost = avgCost;
		this.stdDev = stdDev;
		this.favg = favg;
	}
	
	public function get(part:Int) : String {
		switch (part) {
			case 0: return recipeName;
			case 1: return "<span class=\"highlighted\">" + avgCost + "</b>";
			case 2: return chance;
			case 3: return avgTries;
			case 4: return recipeCost;
			case 5: return stdDev;
			default: return "N/A";
		}
	}
	
}