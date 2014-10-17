package ;

/**
 * Holds the information for a possible Vorici recipe.
 * @author Siveran
 */
class Recipe {
	public var description:String;
	public var red:Int;
	public var green:Int; 
	public var blue:Int;
	public var cost:Int;
	public var level:Int;
	
	public function new(r:Int, g:Int, b:Int, c:Int, l:Int, d:String = null) {
		red = r;
		green = g;
		blue = b;
		cost = c;
		level = l;
		if (d == null) {
			description = "Vorici " + (r > 0 ? r + "R" : "") +  (g > 0 ? g + "G" : "") + (b > 0 ? b + "B" : "");
		} else {
			description = d;
		}
	}
	
}