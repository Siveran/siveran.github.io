package ;

/**
 * Holds the information of a crafting option.
 * @author Siveran
 */
class Probability {
	public var how:String;
	public var prob:String;
	public var tries:String;
	public var cost:String;
	public var avg:String;
	public var reqVorici:String;
	public var favg:Float;
	
	public function new(h:String, p:String, t:String, c:String, a:String, v:String, f:Float = 0) {
		how = h;
		prob = p;
		tries = t;
		cost = c;
		avg = a;
		reqVorici = v;
		favg = f;
	}
	
	public function get(part:Int) : String {
		switch (part) {
			case 0: return how;
			case 1: return prob;
			case 2: return tries;
			case 3: return cost;
			case 4: return avg;
			case 5: return reqVorici;
			default: return "N/A";
		}
	}
	
}