package ;

/**
 * Magic! A bunch of unrelated utilities that projects may or may not use.
 * @author Siveran
 */

class Utils {
	public static inline var TWOPI = 6.28318530717958647693;
	
	/* RAP ANGEL
	 * This wraps an angle into the [-PI, PI] range. */ 
	public static inline function wrapAngle(x:Float) : Float {
		return wrap2(x, -Math.PI, Math.PI);
	}
	
	/* Wraps a value into the bounds [0,limit], e.g. -100, 600 becomes 500. It's essentially mod, but it works for negatives. */
	public static inline function wrap(v:Float, limit:Float) : Float {
		while (v < 0) {
			v += limit;
		}
		
		while (v > limit) {
			v -= limit;
		}
		
		return v;
	}
	
	/* Wraps a value into the bounds [lowerLimit, upperLimit] */
	public static inline function wrap2(v:Float, lowerLimit:Float, upperLimit:Float) : Float {
		v = wrap(v - lowerLimit, upperLimit);
		return v + lowerLimit;
	}
	
	/* Like Math.abs, but inlined so it's faster */
	public static inline function abs(a:Float) : Float {
		return (a>0 ? a : -a);
	}
	
	/* Like Math.max, but inlined so it's faster */
	public static inline function max(a:Float, b:Float) : Float {
		return (a > b ? a : b);
	}
	
	/* Like Math.min, but inlined so it's faster */
	public static inline function min(a:Float, b:Float) : Float {
		return (a < b ? a : b);
	}
	
	/* Clamps a value into the bounds [min, max]. A value below min will become min; a value above max will become max. */
	public static inline function clamp(a:Float, min:Float, max:Float) : Float {
		return (a < min ? min : (a > max ? max : a));
	}
	
	/* Like Math.abs, but inlined so it's faster */
	public static inline function iabs(a:Int) : Int {
		return (a>0 ? a : -a);
	}
	
	/* Like Math.max, but inlined so it's faster */
	public static inline function imax(a:Int, b:Int) : Int {
		return (a > b ? a : b);
	}
	
	#if flash
	/* Like Math.max, but inlined so it's faster */
	public static inline function uimax(a:UInt, b:UInt) : UInt {
		return (a > b ? a : b);
	}
	#end
	
	/* Like Math.min, but inlined so it's faster */
	public static inline function imin(a:Int, b:Int) : Int {
		return (a < b ? a : b);
	}
	
	/* Clamps a value into the bounds [min, max]. A value below min will become min; a value above max will become max. */
	public static inline function iclamp(a:Int, min:Int, max:Int) : Int {
		return (a < min ? min : (a > max ? max : a));
	}
	
	/* Strips whitespace from a string. */
	public static inline function stripSpace(s:String) : String {
		var output:String;
		output = StringTools.replace(s, " ", "");
		output = StringTools.replace(s, "\t", "");
		output = StringTools.replace(s, "\n", "");
		return output;
	}
	
	public static inline function lineCollide(l1:Int, r1:Int, l2:Int, r2:Int) : Bool {
		return (l1 <= r2 && r1 >= l2);
	}
	
	/* Checks to see if the point (x,y) is in the specified rectangle. */ 
	public static inline function rectContains(leftX:Int, topY:Int, width:Int, height:Int, x:Int, y:Int) : Bool {
		return (x >= leftX && x <= leftX + width && y <= topY + height && y >= topY);
	}
	
	/**
	 * This converts some raw coordinates to an index, indicating what tile those raw coordinates lie over.
	 * 
	 * @return  -1 if the coordinates were outside the gridamajig, otherwise an integer between 0 and widthInTiles * heightInTiles - 1
	 * */
	public static inline function rectGridIndex(leftX:Int, topY:Int, widthInTiles:Int, heightInTiles:Int, tileWidth:Int, tileHeight:Int, x:Int, y:Int) : Int {
		return rectContains(leftX, topY, widthInTiles*tileWidth - 1, heightInTiles*tileHeight - 1, x, y) ? Std.int((x - leftX) / tileWidth) + widthInTiles * Std.int((y - topY) / tileWidth) : -1;
	}
	
	/* Checks to see if x,y is contained in the specified triangle. All sorts of weirdnesses are allowed! */
	public static function triContains(x1:Int, y1:Int, x2:Int, y2:Int, x3:Int, y3:Int, x:Int, y:Int) : Bool {
		var lx:Int;
		var ly:Int;
		var mx:Int;
		var my:Int;
		var rx:Int;
		var ry:Int;
		var crossY1:Int;
		var crossY2:Int;
		var midident:Int; // This number determines which of the three vertexes is the horizontally middle vertex!
		
		// Find leftmost point
		if (x1 <= x2 && x1 <= x3) { lx = x1; ly = y1; midident = 1; }
		else if (x2 <= x1 && x2 <= x3) { lx = x2; ly = y2; midident = 2; }
		else { lx = x3; ly = y3; midident = 3; }
		
		// Find rightmost point
		if (x1 > x2 && x1 > x3) { rx = x1; ry = y1; midident += 1; }
		else if (x2 > x1 && x2 > x3) { rx = x2; ry = y2; midident += 2; }
		else { rx = x3; ry = y3; midident += 3; }
		
		// Find middle point
		if (midident == 5) { mx = x1; my = y1; }
		else if (midident == 4) { mx = x2; my = y2; }
		else { mx = x3; my = y3; }
		
		// Find y position and height of the cross-section at x
		if (x >= lx && x <= rx) {
			if (x < mx) {
				crossY1 = Std.int(((x - lx) / (mx - lx)) * (my - ly) + ly);
				crossY2 = Std.int(((x - lx) / (rx - lx)) * (ry - ly) + ly);
				if (crossY1 <= crossY2) {
					return (y >= crossY1 && y <= crossY2);
				} else return (y <= crossY1 && y >= crossY2);
			} else {
				if (rx == mx) {
					if (rx == lx) {
						crossY1 = imin(ly, imin(my, ry));
						crossY2 = imax(ly, imax(my, ry));
					} else {
						crossY1 = my;
						crossY2 = ry;
					}
				} else {
					crossY1 = Std.int(((rx - x) / (rx - mx)) * (my - ry) + ly);
					crossY2 = Std.int(((rx - x) / (rx - lx)) * (ly - ry) + ly);
				}
				if (crossY1 <= crossY2) {
					return (y >= crossY1 && y <= crossY2);
				} else return (y <= crossY1 && y >= crossY2);
			}
		}
		
		return false;
	}
	
	/* A proper-like triangle. x1 < x2 < x3. */
	public static function properTriContains(lx:Int, ly:Int, mx:Int, my:Int, rx:Int, ry:Int, x:Int, y:Int) : Bool {
		var crossY1:Int;
		var crossY2:Int;
		
		// Find y position and height of the cross-section at x
		if (x >= lx && x <= rx) {
			if (x < mx) {
				crossY1 = Std.int(((x - lx) / (mx - lx)) * (my - ly) + ly);
				crossY2 = Std.int(((x - lx) / (rx - lx)) * (ry - ly) + ly);
				if (crossY1 <= crossY2) {
					return (y >= crossY1 && y <= crossY2);
				} else return (y <= crossY1 && y >= crossY2);
			} else {
				crossY1 = Std.int(((rx - x) / (rx - mx)) * (my - ry) + ry);
				crossY2 = Std.int(((rx - x) / (rx - lx)) * (ly - ry) + ry);
				if (crossY1 <= crossY2) {
					return (y >= crossY1 && y <= crossY2);
				} else return (y <= crossY1 && y >= crossY2);
			}
		}
		
		return false;
	}
	
	/* Checks to see if x,y is contained in the specified circle */
	public static inline function circleContains(centerX:Int, centerY:Int, radius:Int, x:Int, y:Int) : Bool {
		return ((x - centerX) * (x - centerX) + (y - centerY) * (y - centerY) <= radius * radius);
	}
	
	public static inline function intAsFixedString(val:Int, digits:Int) : String {
		var limit:Int = 1;
		var i = digits;
		while (i > 0) {
			--i;
			limit *= 10;
		}
		var string:String = Std.string(imin(limit-1, val));
		digits -= string.length;
		while (digits > 0) {
			--digits;
			string = "0" + string;
		}
		return string;
	}
	
	public static inline function intAsFixedHTML(val:Int, digits:Int, numColor:String = "161616", zeroColor:String = "444444") : String {
		var limit:Int = 1;
		var i = digits;
		while (i > 0) {
			--i;
			limit *= 10;
		}
		var string:String = Std.string(imin(limit-1, val));
		digits -= string.length;
		
		if (digits > 0) {
			string = "</font>" + string + "</font>";
			while (digits > 0) {
				--digits;
				string = "0" + string;
			}
			string = "<font color=\"#" + numColor + "\">" + "<font color=\"#" + zeroColor + "\">" + string;
		}
		return string;
	}
	
	public static inline function floatAsIntString(val:Float) : String {
		return Std.string(val).split(".")[0];
	}
	
	public static inline function floatAsFixedHTML(val:Float, digits:Int, numColor:String = "161616", zeroColor:String = "444444") : String {
		var limit:Float = 1;
		var i = digits;
		while (i > 0) {
			--i;
			limit *= 10;
		}
		var string:String = Std.string(min(limit - 1, val)).split(".")[0];
		
		digits -= string.length;
		
		if (digits > 0) {
			string = "</font>" + string + "</font>";
			while (digits > 0) {
				--digits;
				string = "0" + string;
			}
			string = "<font color=\"#" + numColor + "\">" + "<font color=\"#" + zeroColor + "\">" + string;
		}
		return string;
	}
	
	public static inline function greaterQuadratic(a:Float, b:Float, c:Float) : Float {
		var retval:Float = 0;
		if (b * b - 4 * a * c >= 0) retval = ( -b + Math.sqrt(b * b - 4 * a * c)) / (2 * a);
		return retval;
	}
	
	public static inline function lesserQuadratic(a:Float, b:Float, c:Float) : Float {
		var retval:Float = 0;
		if (b * b - 4 * a * c >= 0) retval = ( -b - Math.sqrt(b * b - 4 * a * c)) / (2 * a);
		return retval;
	}
	
	public static inline function sign(a:Float) : Int {
		if (a > 0) return 1;
		else if (a < 0) return -1;
		else return 0;
	}
	
	public static inline function isign(a:Int) : Int {
		if (a > 0) return 1;
		else if (a < 0) return -1;
		else return 0;
	}
	
	#if flash
	public static inline function charWrap(text:String, charsPerLine:UInt) : String {
		if (charsPerLine == 0) return "";
		else {
			var i:Int = 0;
			var lines:Int = Std.int(text.length / charsPerLine);
			var outs:StringBuf = new StringBuf();
			while (i < lines) {
				outs.addSub(text, i * charsPerLine, charsPerLine);
				outs.addChar(10); // "\n"
				++i;
			}
			if (mod(text.length, charsPerLine) != 0) outs.addSub(text, lines * charsPerLine);
			return outs.toString();
		}
	}
	#end
	
	public static inline function wordWrap(text:String, charsPerLine:Int) : String {
		if (charsPerLine <= 0) return "";
		else {
			var i:Int = 0;
			var lastSpace:Int = -1;
			var lastLine:Int = 0;
			var currentLine:Int = 0;
			var len:Int = text.length;
			var outs:StringBuf = new StringBuf();
			while (i < len) {
				if (text.charCodeAt(i) == 32) lastSpace = i;
				else if (text.charCodeAt(i) == 10) { // There's an \n in the string
					outs.addSub(text, lastLine, i - lastLine + 1);
					currentLine = 0;
					lastLine = i + 1;
				}
				if (currentLine >= charsPerLine) {
					if (lastSpace == -1) {
						// Run-on word, crop to character
						outs.addSub(text, lastLine, charsPerLine);
						outs.addChar(10); // \n
						lastLine = lastLine + charsPerLine;
					} else {
						outs.addSub(text, lastLine, lastSpace - lastLine);
						outs.addChar(10); // \n
						lastLine = lastSpace + 1;
					}
					currentLine = i - lastLine;
					lastSpace = -1;
				}
				++currentLine;
				++i;
			}
			if (lastLine < len - 1) outs.addSub(text, lastLine, charsPerLine);
			return outs.toString();
		}
	}
	
	public static inline function intNoOverflow(f:Float) : Int {
		return f >= 2147483647.0 ? 0x7FFFFFFF : f <= -2147483647.0 ? 0xFFFFFFFF : Std.int(f);
	}
	
	#if flash
	public static inline function secondsToString(i:UInt) : String {
		return "" + intAsFixedString(Std.int(i / 3600), 2) + ":" + intAsFixedString(Utils.mod(Std.int(i / 60), 60), 2) + ":" + intAsFixedString(Utils.mod(i, 60), 2);
	}
	#end
	
	public static inline function floatToPrecisionString(f:Float, precision:Int = 5) : String {
		f = f * Math.pow(10, precision);
		var i:Int = Math.round(f);
		var s:String = Std.string(i);
		if (s.length <= precision) s = intAsFixedString(i, precision + 1);
		return s.substr(0, s.length - precision) + "." + s.substr(s.length - precision);
	}
	
	public static inline function floatToPercent(f:Float) : String {
		return floatToPrecisionString(f * 100, 3) + "%"; 
	}
	
	public inline static function mod(a:Int, b:Int) : Int {
		return a - Std.int(a / b) * b;
	}
	
	public inline static function log2(v:Int) : Int {
		var r:Int = 0;
		while (v >= 0x1F) {
			v >>= 4;
			r += 4;
		}
		while (v > 1) {
			v >>= 1;
			++r;
		}
		return r;
	}
	
	public inline static function factorial(x:Int) : Int {
		var sign:Int = 1;
		var r:Int = 1;
		
		if (x < 0) {
			sign = -1;
			x *= -1;
		}
		
		while (x > 1) {
			r *= x;
			--x;
		}
		
		return r * sign;
	}
	
	private function new() {
		// nooooooooo
	}
	
}