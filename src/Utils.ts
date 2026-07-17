/**
 * Ancient remnants from when this was a Haxe project.
 * A lot of these utilities were only improvements over alternatives due to being inlineable in Haxe,
 * but they're not explicitly inlineable in TypeScript. They're here for compatibility with the old code.
 * @author Siveran
 */

export class Utils {
	public static TWOPI = 6.28318530717958647693;
	
	/* This wraps an angle into the [-PI, PI] range. */ 
	public static wrapAngle(x: number) : number {
		return Utils.wrap2(x, -Math.PI, Math.PI);
	}
	
	/* Wraps a value into the bounds [0,limit], e.g. -100, 600 becomes 500. It's essentially mod, but it works for negatives. */
	public static wrap(v: number, limit: number) : number {
		while (v < 0) {
			v += limit;
		}
		
		while (v > limit) {
			v -= limit;
		}
		
		return v;
	}
	
	/* Wraps a value into the bounds [lowerLimit, upperLimit] */
	public static wrap2(v: number, lowerLimit: number, upperLimit: number) : number {
		v = Utils.wrap(v - lowerLimit, upperLimit);
		return v + lowerLimit;
	}
	
	/* Like Math.abs, but inlined so it's faster */
	public static abs(a: number) : number {
		return (a>0 ? a : -a);
	}
	
	/* Like Math.max, but inlined so it's faster */
	public static max(a: number, b: number) : number {
		return (a > b ? a : b);
	}
	
	/* Like Math.min, but inlined so it's faster */
	public static min(a: number, b: number) : number {
		return (a < b ? a : b);
	}
	
	/* Clamps a value into the bounds [min, max]. A value below min will become min; a value above max will become max. */
	public static clamp(a: number, min: number, max: number) : number {
		return (a < min ? min : (a > max ? max : a));
	}
	
	/* Like Math.abs, but inlined so it's faster */
	public static iabs(a: number) : number {
		return (a>0 ? a : -a);
	}
	
	/* Like Math.max, but inlined so it's faster */
	public static imax(a: number, b: number) : number {
		return (a > b ? a : b);
	}
	
	/* Like Math.min, but inlined so it's faster */
	public static imin(a: number, b: number) : number {
		return (a < b ? a : b);
	}
	
	/* Clamps a value into the bounds [min, max]. A value below min will become min; a value above max will become max. */
	public static iclamp(a: number, min: number, max: number) : number {
		return (a < min ? min : (a > max ? max : a));
	}
	
	/* Strips whitespace from a string. */
	/*
	public static stripSpace(s: string) : string {
		var output: string;
		output = StringTools.replace(s, " ", "");
		output = StringTools.replace(s, "\t", "");
		output = StringTools.replace(s, "\n", "");
		return output;
	}*/
	
	public static lineCollide(l1: number, r1: number, l2: number, r2: number) : boolean {
		return (l1 <= r2 && r1 >= l2);
	}
	
	/* Checks to see if the point (x,y) is in the specified rectangle. */ 
	public static rectContains(leftX: number, topY: number, width: number, height: number, x: number, y: number) : boolean {
		return (x >= leftX && x <= leftX + width && y <= topY + height && y >= topY);
	}
	
	/**
	 * This converts some raw coordinates to an index, indicating what tile those raw coordinates lie over.
	 * 
	 * @return  -1 if the coordinates were outside the gridamajig, otherwise an integer between 0 and widthInTiles * heightInTiles - 1
	 * */
	public static rectGridIndex(leftX: number, topY: number, widthInTiles: number, heightInTiles: number, tileWidth: number, tileHeight: number, x: number, y: number) : number {
		return Utils.rectContains(leftX, topY, widthInTiles*tileWidth - 1, heightInTiles*tileHeight - 1, x, y) ? Math.round((x - leftX) / tileWidth) + widthInTiles * Math.round((y - topY) / tileWidth) : -1;
	}
	
	/* Checks to see if x,y is contained in the specified triangle. All sorts of weirdnesses are allowed! */
	public static triContains(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, x: number, y: number) : boolean {
		var lx: number;
		var ly: number;
		var mx: number;
		var my: number;
		var rx: number;
		var ry: number;
		var crossY1: number;
		var crossY2: number;
		var midident: number; // This number determines which of the three vertexes is the horizontally middle vertex!
		
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
				crossY1 = Math.round(((x - lx) / (mx - lx)) * (my - ly) + ly);
				crossY2 = Math.round(((x - lx) / (rx - lx)) * (ry - ly) + ly);
				if (crossY1 <= crossY2) {
					return (y >= crossY1 && y <= crossY2);
				} else return (y <= crossY1 && y >= crossY2);
			} else {
				if (rx == mx) {
					if (rx == lx) {
						crossY1 = Utils.imin(ly, Utils.imin(my, ry));
						crossY2 = Utils.imax(ly, Utils.imax(my, ry));
					} else {
						crossY1 = my;
						crossY2 = ry;
					}
				} else {
					crossY1 = Math.round(((rx - x) / (rx - mx)) * (my - ry) + ly);
					crossY2 = Math.round(((rx - x) / (rx - lx)) * (ly - ry) + ly);
				}
				if (crossY1 <= crossY2) {
					return (y >= crossY1 && y <= crossY2);
				} else return (y <= crossY1 && y >= crossY2);
			}
		}
		
		return false;
	}
	
	/* A proper-like triangle. x1 < x2 < x3. */
	public static properTriContains(lx: number, ly: number, mx: number, my: number, rx: number, ry: number, x: number, y: number) : boolean {
		var crossY1: number;
		var crossY2: number;
		
		// Find y position and height of the cross-section at x
		if (x >= lx && x <= rx) {
			if (x < mx) {
				crossY1 = Math.round(((x - lx) / (mx - lx)) * (my - ly) + ly);
				crossY2 = Math.round(((x - lx) / (rx - lx)) * (ry - ly) + ly);
				if (crossY1 <= crossY2) {
					return (y >= crossY1 && y <= crossY2);
				} else return (y <= crossY1 && y >= crossY2);
			} else {
				crossY1 = Math.round(((rx - x) / (rx - mx)) * (my - ry) + ry);
				crossY2 = Math.round(((rx - x) / (rx - lx)) * (ly - ry) + ry);
				if (crossY1 <= crossY2) {
					return (y >= crossY1 && y <= crossY2);
				} else return (y <= crossY1 && y >= crossY2);
			}
		}
		
		return false;
	}
	
	/* Checks to see if x,y is contained in the specified circle */
	public static circleContains(centerX: number, centerY: number, radius: number, x: number, y: number) : boolean {
		return ((x - centerX) * (x - centerX) + (y - centerY) * (y - centerY) <= radius * radius);
	}
	
	public static intAsFixedString(val: number, digits: number) : string {
		var limit: number = 1;
		var i = digits;
		while (i > 0) {
			--i;
			limit *= 10;
		}
		var string: string = "" + Utils.imin(limit-1, val);
		digits -= string.length;
		while (digits > 0) {
			--digits;
			string = "0" + string;
		}
		return string;
	}
	
	public static intAsFixedHTML(val: number, digits: number, numColor: string = "161616", zeroColor: string = "444444") : string {
		var limit: number = 1;
		var i = digits;
		while (i > 0) {
			--i;
			limit *= 10;
		}
		var string: string = "" + Utils.imin(limit-1, val);
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
	
	public static floatAsIntString(val: number) : string {
		return ("" + val).split(".")[0] as string;
	}
	
	public static floatAsFixedHTML(val: number, digits: number, numColor: string = "161616", zeroColor: string = "444444") : string {
		var limit: number = 1;
		var i = digits;
		while (i > 0) {
			--i;
			limit *= 10;
		}
		var string: string = ("" + Utils.min(limit - 1, val)).split(".")[0] as string;
		
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
	
	public static greaterQuadratic(a: number, b: number, c: number) : number {
		var retval: number = 0;
		if (b * b - 4 * a * c >= 0) retval = ( -b + Math.sqrt(b * b - 4 * a * c)) / (2 * a);
		return retval;
	}
	
	public static lesserQuadratic(a: number, b: number, c: number) : number {
		var retval: number = 0;
		if (b * b - 4 * a * c >= 0) retval = ( -b - Math.sqrt(b * b - 4 * a * c)) / (2 * a);
		return retval;
	}
	
	public static sign(a: number) : number {
		if (a > 0) return 1;
		else if (a < 0) return -1;
		else return 0;
	}
	
	public static isign(a: number) : number {
		if (a > 0) return 1;
		else if (a < 0) return -1;
		else return 0;
	}
	
	public static intNoOverflow(f: number) : number {
		return f >= 2147483647.0 ? 0x7FFFFFFF : f <= -2147483647.0 ? 0xFFFFFFFF : Math.round(f);
	}
	
	public static floatToPrecisionString(f: number, precision: number = 5, commas:boolean = true) : string {
		var prefix: string = "";
		if (f < 0) {
			f *= -1;
			prefix = "-";
		}
		f = f * Math.pow(10, precision);
		var i: number = Math.round(f);
		if (i == 0 && f > 0.00000000001) {
			i = 1;
			if (prefix == "-") {
				prefix = ">-";
			} else {
				prefix = "<";
			}
		}
		var s: string = "" + i;
		if (s.length <= precision) s = Utils.intAsFixedString(i, precision + 1);
		
		var result: string = "";
		var j: number = s.length - precision;
		if (commas) {
			while (j > 3) {
				j -= 3;
				result = "," + s.substr(j, 3) + result;
			}
			result = s.substring(0, j) + result + "." + s.substr(s.length - precision);
		} else {
			result = s.substr(0, s.length - precision) + "." + s.substr(s.length - precision);
		}
		return prefix + result;
	}
	
	public static floatToPercent(f: number, precision: number = 5) : string {
		return Utils.floatToPrecisionString(f * 100, precision, false) + "%"; 
	}
	
	public static mod(a: number, b: number) : number {
		return a - Math.round(a / b) * b;
	}
	
	public static log2(v: number) : number {
		var r: number = 0;
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
	
	public static factorial(x: number) : number {
		var sign: number = 1;
		var r: number = 1;
		
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
}