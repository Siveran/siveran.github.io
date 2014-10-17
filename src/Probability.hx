package ;

/**
 * Holds the information of a crafting option.
 * @author Siveran
 */
class Probability {
	public var how:String;
	public var prob:String;
	public var cost:String;
	public var avg:String;
	public var reqVorici:String;
	
	public function new(h:String, p:String, c:String, a:String, v:String) {
		how = h;
		prob = p;
		cost = c;
		avg = a;
		reqVorici = v;
	}
	
	public function get(part:Int) : String {
		switch (part) {
			case 0: return how;
			case 1: return prob;
			case 2: return cost;
			case 3: return avg;
			case 4: return reqVorici;
			default: return "N/A";
		}
	}
	
}