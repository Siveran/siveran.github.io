(function ($hx_exports) { "use strict";
var HxOverrides = function() { };
HxOverrides.__name__ = true;
HxOverrides.cca = function(s,index) {
	var x = s.charCodeAt(index);
	if(x != x) return undefined;
	return x;
};
HxOverrides.substr = function(s,pos,len) {
	if(pos != null && pos != 0 && len != null && len < 0) return "";
	if(len == null) len = s.length;
	if(pos < 0) {
		pos = s.length + pos;
		if(pos < 0) pos = 0;
	} else if(len < 0) len = s.length + len - pos;
	return s.substr(pos,len);
};
var Main = $hx_exports.Main = function() { };
Main.__name__ = true;
Main.main = function() {
	Main.recipes = new Array();
	Main.recipes.push(new Recipe(0,0,0,1,0,"Drop Rate"));
	Main.recipes.push(new Recipe(0,0,0,1,0,"Chromatic"));
	Main.recipes.push(new Recipe(1,0,0,4,2));
	Main.recipes.push(new Recipe(0,1,0,4,2));
	Main.recipes.push(new Recipe(0,0,1,4,2));
	Main.recipes.push(new Recipe(2,0,0,25,3));
	Main.recipes.push(new Recipe(0,2,0,25,3));
	Main.recipes.push(new Recipe(0,0,2,25,3));
	Main.recipes.push(new Recipe(0,1,1,15,4));
	Main.recipes.push(new Recipe(1,0,1,15,4));
	Main.recipes.push(new Recipe(1,1,0,15,4));
	Main.recipes.push(new Recipe(3,0,0,285,6));
	Main.recipes.push(new Recipe(0,3,0,285,6));
	Main.recipes.push(new Recipe(0,0,3,285,6));
	Main.recipes.push(new Recipe(2,1,0,100,7));
	Main.recipes.push(new Recipe(2,0,1,100,7));
	Main.recipes.push(new Recipe(1,2,0,100,7));
	Main.recipes.push(new Recipe(0,2,1,100,7));
	Main.recipes.push(new Recipe(1,0,2,100,7));
	Main.recipes.push(new Recipe(0,1,2,100,7));
	Main.sockField = window.document.getElementById("sockets");
	Main.strField = window.document.getElementById("str");
	Main.dexField = window.document.getElementById("dex");
	Main.intField = window.document.getElementById("int");
	Main.redField = window.document.getElementById("red");
	Main.greenField = window.document.getElementById("green");
	Main.blueField = window.document.getElementById("blue");
	Main.table = window.document.getElementById("resultbody");
	Main.tableWhole = window.document.getElementById("result");
	var i = 0;
	var j;
	var _g = 0;
	var _g1 = Main.recipes;
	while(_g < _g1.length) {
		var r = _g1[_g];
		++_g;
		var tr;
		var _this = window.document;
		tr = _this.createElement("tr");
		var td;
		j = 6;
		while(j > 0) {
			var _this1 = window.document;
			td = _this1.createElement("td");
			if(i < 4) td.innerHTML = "-";
			tr.appendChild(td);
			--j;
		}
		if(i >= 4) tr.style.display = "none";
		tr.classList.add("prob");
		Main.table.appendChild(tr);
		++i;
	}
	window.document.getElementById("calcButton").onclick = Main.calculate;
};
Main.flipTableStripes = function() {
	var i = 0;
	var tr = Main.table.firstElementChild;
	while(tr != null) {
		++i;
		if(tr.firstElementChild.innerHTML != "") tr = null; else tr = tr.nextElementSibling;
	}
	tr = Main.table.firstElementChild;
	while(tr != null) {
		tr.classList.toggle("reverseStripe",i % 2 == 0);
		tr = tr.nextElementSibling;
	}
};
Main.updateTable = function(probs) {
	var row = Main.table.firstElementChild;
	var mindex = 0;
	var min = 0;
	var i = 0;
	var j = 0;
	var _g = 0;
	while(_g < probs.length) {
		var p = probs[_g];
		++_g;
		if(p.favg > 0 && (min == 0 || min > p.favg)) {
			mindex = i;
			min = p.favg;
		}
		++i;
	}
	var _g1 = 0;
	while(_g1 < probs.length) {
		var p1 = probs[_g1];
		++_g1;
		i = 0;
		var td = row.firstElementChild;
		while(td != null) {
			td.innerHTML = p1.get(i);
			td = td.nextElementSibling;
			++i;
		}
		row.style.display = "table-row";
		row.classList.toggle("best",mindex == j);
		row.classList.remove("reverseStripe");
		row = row.nextElementSibling;
		++j;
	}
	while(row != null) {
		var td1 = row.firstElementChild;
		while(td1 != null) {
			td1.innerHTML = "";
			td1 = td1.nextElementSibling;
		}
		row.style.display = "none";
		row.classList.remove("best");
		row = row.nextElementSibling;
	}
	var th = Main.tableWhole.tHead.firstElementChild.firstElementChild;
	i = 0;
	while(th != null) {
		var s = "";
		switch(i) {
		case 0:
			s = "Craft Type";
			break;
		case 1:
			s = "Success Chance";
			break;
		case 2:
			s = "Average Attempts<br/><span class=\"tablesubtitle\">(mean)</span>";
			break;
		case 3:
			s = "Cost per Try<br/><span class=\"tablesubtitle\">(in chromatics)</span>";
			break;
		case 4:
			s = "Average Cost<br/><span class=\"tablesubtitle\">(in chromatics)</span>";
			break;
		case 5:
			s = "Std. Deviation<br/><span class=\"tablesubtitle\">(of attempts)</span>";
			break;
		}
		th.classList.remove("SortTable_sorted");
		th.classList.remove("SortTable_sorted_reverse");
		th.innerHTML = s;
		th = th.nextElementSibling;
		++i;
	}
	SortTable.makeSortable(Main.tableWhole);
	SortTable.makeSortable(Main.tableWhole);
};
Main.calculate = function(d) {
	var probs = new Array();
	var error = false;
	var socks = Std.parseInt(Main.sockField.value);
	var str = Std.parseInt(Main.strField.value);
	var dex = Std.parseInt(Main.dexField.value);
	var $int = Std.parseInt(Main.intField.value);
	var red = Std.parseInt(Main.redField.value);
	var green = Std.parseInt(Main.greenField.value);
	var blue = Std.parseInt(Main.blueField.value);
	if(str == null) str = 0;
	if(dex == null) dex = 0;
	if($int == null) $int = 0;
	if(str > 0 && dex == 0 && $int == 0) str += 32;
	if(str == 0 && dex > 0 && $int == 0) dex += 32;
	if(str == 0 && dex == 0 && $int > 0) $int += 32;
	if(socks <= 0 || socks > 6) {
		error = true;
		probs.push(new Probability("Error:","Invalid","number","of","sockets.",":("));
	}
	if(str < 0 || dex < 0 || $int < 0) {
		error = true;
		probs.push(new Probability("Error:","Invalid","item","stat","requirements.",":("));
	}
	if(red < 0 || green < 0 || blue < 0 || red + blue + green == 0 || red > 6 || green > 6 || blue > 6 || red + blue + green > socks) {
		error = true;
		probs.push(new Probability("Error:","Invalid","desired","socket","colors.",":("));
	}
	if(!error) probs = Main.getProbabilities(str,dex,$int,socks,red,green,blue);
	Main.updateTable(probs);
};
Main.getProbabilities = function(str,dex,$int,sockets,dred,dgreen,dblue) {
	var probs = new Array();
	var div = str + dex + $int + 3 * Main.X;
	if(sockets > 6 || dred > 6 || dgreen > 6 || dblue > 6 || sockets <= 0 || dred < 0 || dgreen < 0 || dblue < 0) {
		probs.push(new Probability("Sorry,","that's","definitely","not","happening.",":I"));
		return probs;
	}
	var _g = 0;
	var _g1 = Main.recipes;
	while(_g < _g1.length) {
		var r = _g1[_g];
		++_g;
		if(r.red <= dred && r.green <= dgreen && r.blue <= dblue) {
			var red = dred - r.red;
			var green = dgreen - r.green;
			var blue = dblue - r.blue;
			var socks = sockets - (r.red + r.green + r.blue);
			var chance;
			haxe.Log.trace(str,{ fileName : "Main.hx", lineNumber : 246, className : "Main", methodName : "getProbabilities", customParams : [dex,$int]});
			Main.rc = (Main.X + str) / div;
			Main.gc = (Main.X + dex) / div;
			Main.bc = (Main.X + $int) / div;
			chance = Main.multinomial(red,green,blue,socks - red - green - blue);
			if(r.description == "Chromatic") {
				var cb = Main.calcChromaticBonus(socks,red,green,blue);
				chance /= 1 - cb;
			}
			probs.push(new Probability(r.description,Utils.floatToPrecisionString(chance * 100,5,false) + "%",Utils.floatToPrecisionString(1 / chance,1,null),r.description == "Drop Rate"?"-":r.cost == null?"null":"" + r.cost,r.description == "Drop Rate"?"-":Utils.floatToPrecisionString(r.cost / chance,1,null),Utils.floatToPrecisionString(Math.sqrt((1 - chance) / (chance * chance)),2,null),r.cost / chance));
		}
	}
	return probs;
};
Main.multinomial = function(red,green,blue,free,pos) {
	if(pos == null) pos = 1;
	if(free > 0) return (pos <= 1?Main.multinomial(red + 1,green,blue,free - 1,1):0) + (pos <= 2?Main.multinomial(red,green + 1,blue,free - 1,2):0) + Main.multinomial(red,green,blue + 1,free - 1,3); else return Utils.factorial(red + green + blue) / (Utils.factorial(red) * Utils.factorial(green) * Utils.factorial(blue)) * Math.pow(Main.rc,red) * Math.pow(Main.gc,green) * Math.pow(Main.bc,blue);
};
Main.calcChromaticBonus = function(free,dred,dgreen,dblue,red,green,blue,pos) {
	if(pos == null) pos = 1;
	if(blue == null) blue = 0;
	if(green == null) green = 0;
	if(red == null) red = 0;
	if(red >= dred && green >= dgreen && blue >= dblue) return 0; else if(free > 0) return (pos <= 1?Main.calcChromaticBonus(free - 1,dred,dgreen,dblue,red + 1,green,blue,1):0) + (pos <= 2?Main.calcChromaticBonus(free - 1,dred,dgreen,dblue,red,green + 1,blue,2):0) + Main.calcChromaticBonus(free - 1,dred,dgreen,dblue,red,green,blue + 1,3); else return Utils.factorial(red + green + blue) / (Utils.factorial(red) * Utils.factorial(green) * Utils.factorial(blue)) * Math.pow(Main.rc,red * 2) * Math.pow(Main.gc,green * 2) * Math.pow(Main.bc,blue * 2);
};
Math.__name__ = true;
var Probability = function(h,p,t,c,a,v,f) {
	if(f == null) f = 0;
	this.how = h;
	this.prob = p;
	this.tries = t;
	this.cost = c;
	this.avg = a;
	this.reqVorici = v;
	this.favg = f;
};
Probability.__name__ = true;
Probability.prototype = {
	get: function(part) {
		switch(part) {
		case 0:
			return this.how;
		case 1:
			return this.prob;
		case 2:
			return this.tries;
		case 3:
			return this.cost;
		case 4:
			return this.avg;
		case 5:
			return this.reqVorici;
		default:
			return "N/A";
		}
	}
};
var Recipe = function(r,g,b,c,l,d) {
	this.red = r;
	this.green = g;
	this.blue = b;
	this.cost = c;
	this.level = l;
	if(d == null) this.description = "Vorici " + (r > 0?r + "R":"") + (g > 0?g + "G":"") + (b > 0?b + "B":""); else this.description = d;
};
Recipe.__name__ = true;
var Std = function() { };
Std.__name__ = true;
Std.string = function(s) {
	return js.Boot.__string_rec(s,"");
};
Std.parseInt = function(x) {
	var v = parseInt(x,10);
	if(v == 0 && (HxOverrides.cca(x,1) == 120 || HxOverrides.cca(x,1) == 88)) v = parseInt(x);
	if(isNaN(v)) return null;
	return v;
};
var StringBuf = function() {
	this.b = "";
};
StringBuf.__name__ = true;
StringBuf.prototype = {
	addSub: function(s,pos,len) {
		if(len == null) this.b += HxOverrides.substr(s,pos,null); else this.b += HxOverrides.substr(s,pos,len);
	}
};
var StringTools = function() { };
StringTools.__name__ = true;
StringTools.replace = function(s,sub,by) {
	return s.split(sub).join(by);
};
var Utils = function() {
};
Utils.__name__ = true;
Utils.wrapAngle = function(x) {
	return Utils.wrap2(x,-Math.PI,Math.PI);
};
Utils.wrap = function(v,limit) {
	while(v < 0) v += limit;
	while(v > limit) v -= limit;
	return v;
};
Utils.wrap2 = function(v,lowerLimit,upperLimit) {
	v = Utils.wrap(v - lowerLimit,upperLimit);
	return v + lowerLimit;
};
Utils.abs = function(a) {
	if(a > 0) return a; else return -a;
};
Utils.max = function(a,b) {
	if(a > b) return a; else return b;
};
Utils.min = function(a,b) {
	if(a < b) return a; else return b;
};
Utils.clamp = function(a,min,max) {
	if(a < min) return min; else if(a > max) return max; else return a;
};
Utils.iabs = function(a) {
	if(a > 0) return a; else return -a;
};
Utils.imax = function(a,b) {
	if(a > b) return a; else return b;
};
Utils.imin = function(a,b) {
	if(a < b) return a; else return b;
};
Utils.iclamp = function(a,min,max) {
	if(a < min) return min; else if(a > max) return max; else return a;
};
Utils.stripSpace = function(s) {
	var output;
	output = StringTools.replace(s," ","");
	output = StringTools.replace(s,"\t","");
	output = StringTools.replace(s,"\n","");
	return output;
};
Utils.lineCollide = function(l1,r1,l2,r2) {
	return l1 <= r2 && r1 >= l2;
};
Utils.rectContains = function(leftX,topY,width,height,x,y) {
	return x >= leftX && x <= leftX + width && y <= topY + height && y >= topY;
};
Utils.rectGridIndex = function(leftX,topY,widthInTiles,heightInTiles,tileWidth,tileHeight,x,y) {
	if(x >= leftX && x <= leftX + (widthInTiles * tileWidth - 1) && y <= topY + (heightInTiles * tileHeight - 1) && y >= topY) return ((x - leftX) / tileWidth | 0) + widthInTiles * ((y - topY) / tileWidth | 0); else return -1;
};
Utils.triContains = function(x1,y1,x2,y2,x3,y3,x,y) {
	var lx;
	var ly;
	var mx;
	var my;
	var rx;
	var ry;
	var crossY1;
	var crossY2;
	var midident;
	if(x1 <= x2 && x1 <= x3) {
		lx = x1;
		ly = y1;
		midident = 1;
	} else if(x2 <= x1 && x2 <= x3) {
		lx = x2;
		ly = y2;
		midident = 2;
	} else {
		lx = x3;
		ly = y3;
		midident = 3;
	}
	if(x1 > x2 && x1 > x3) {
		rx = x1;
		ry = y1;
		midident += 1;
	} else if(x2 > x1 && x2 > x3) {
		rx = x2;
		ry = y2;
		midident += 2;
	} else {
		rx = x3;
		ry = y3;
		midident += 3;
	}
	if(midident == 5) {
		mx = x1;
		my = y1;
	} else if(midident == 4) {
		mx = x2;
		my = y2;
	} else {
		mx = x3;
		my = y3;
	}
	if(x >= lx && x <= rx) {
		if(x < mx) {
			crossY1 = (x - lx) / (mx - lx) * (my - ly) + ly | 0;
			crossY2 = (x - lx) / (rx - lx) * (ry - ly) + ly | 0;
			if(crossY1 <= crossY2) return y >= crossY1 && y <= crossY2; else return y <= crossY1 && y >= crossY2;
		} else {
			if(rx == mx) {
				if(rx == lx) {
					crossY1 = Utils.imin(ly,my < ry?my:ry);
					crossY2 = Utils.imax(ly,my > ry?my:ry);
				} else {
					crossY1 = my;
					crossY2 = ry;
				}
			} else {
				crossY1 = (rx - x) / (rx - mx) * (my - ry) + ly | 0;
				crossY2 = (rx - x) / (rx - lx) * (ly - ry) + ly | 0;
			}
			if(crossY1 <= crossY2) return y >= crossY1 && y <= crossY2; else return y <= crossY1 && y >= crossY2;
		}
	}
	return false;
};
Utils.properTriContains = function(lx,ly,mx,my,rx,ry,x,y) {
	var crossY1;
	var crossY2;
	if(x >= lx && x <= rx) {
		if(x < mx) {
			crossY1 = (x - lx) / (mx - lx) * (my - ly) + ly | 0;
			crossY2 = (x - lx) / (rx - lx) * (ry - ly) + ly | 0;
			if(crossY1 <= crossY2) return y >= crossY1 && y <= crossY2; else return y <= crossY1 && y >= crossY2;
		} else {
			crossY1 = (rx - x) / (rx - mx) * (my - ry) + ry | 0;
			crossY2 = (rx - x) / (rx - lx) * (ly - ry) + ry | 0;
			if(crossY1 <= crossY2) return y >= crossY1 && y <= crossY2; else return y <= crossY1 && y >= crossY2;
		}
	}
	return false;
};
Utils.circleContains = function(centerX,centerY,radius,x,y) {
	return (x - centerX) * (x - centerX) + (y - centerY) * (y - centerY) <= radius * radius;
};
Utils.intAsFixedString = function(val,digits) {
	var limit = 1;
	var i = digits;
	while(i > 0) {
		--i;
		limit *= 10;
	}
	var string = Std.string(Utils.imin(limit - 1,val));
	digits -= string.length;
	while(digits > 0) {
		--digits;
		string = "0" + string;
	}
	return string;
};
Utils.intAsFixedHTML = function(val,digits,numColor,zeroColor) {
	if(zeroColor == null) zeroColor = "444444";
	if(numColor == null) numColor = "161616";
	var limit = 1;
	var i = digits;
	while(i > 0) {
		--i;
		limit *= 10;
	}
	var string = Std.string(Utils.imin(limit - 1,val));
	digits -= string.length;
	if(digits > 0) {
		string = "</font>" + string + "</font>";
		while(digits > 0) {
			--digits;
			string = "0" + string;
		}
		string = "<font color=\"#" + numColor + "\">" + "<font color=\"#" + zeroColor + "\">" + string;
	}
	return string;
};
Utils.floatAsIntString = function(val) {
	return (val == null?"null":"" + val).split(".")[0];
};
Utils.floatAsFixedHTML = function(val,digits,numColor,zeroColor) {
	if(zeroColor == null) zeroColor = "444444";
	if(numColor == null) numColor = "161616";
	var limit = 1;
	var i = digits;
	while(i > 0) {
		--i;
		limit *= 10;
	}
	var string = Std.string(Utils.min(limit - 1,val)).split(".")[0];
	digits -= string.length;
	if(digits > 0) {
		string = "</font>" + string + "</font>";
		while(digits > 0) {
			--digits;
			string = "0" + string;
		}
		string = "<font color=\"#" + numColor + "\">" + "<font color=\"#" + zeroColor + "\">" + string;
	}
	return string;
};
Utils.greaterQuadratic = function(a,b,c) {
	var retval = 0;
	if(b * b - 4 * a * c >= 0) retval = (-b + Math.sqrt(b * b - 4 * a * c)) / (2 * a);
	return retval;
};
Utils.lesserQuadratic = function(a,b,c) {
	var retval = 0;
	if(b * b - 4 * a * c >= 0) retval = (-b - Math.sqrt(b * b - 4 * a * c)) / (2 * a);
	return retval;
};
Utils.sign = function(a) {
	if(a > 0) return 1; else if(a < 0) return -1; else return 0;
};
Utils.isign = function(a) {
	if(a > 0) return 1; else if(a < 0) return -1; else return 0;
};
Utils.wordWrap = function(text,charsPerLine) {
	if(charsPerLine <= 0) return ""; else {
		var i = 0;
		var lastSpace = -1;
		var lastLine = 0;
		var currentLine = 0;
		var len = text.length;
		var outs = new StringBuf();
		while(i < len) {
			if(HxOverrides.cca(text,i) == 32) lastSpace = i; else if(HxOverrides.cca(text,i) == 10) {
				outs.addSub(text,lastLine,i - lastLine + 1);
				currentLine = 0;
				lastLine = i + 1;
			}
			if(currentLine >= charsPerLine) {
				if(lastSpace == -1) {
					if(charsPerLine == null) outs.b += HxOverrides.substr(text,lastLine,null); else outs.b += HxOverrides.substr(text,lastLine,charsPerLine);
					outs.b += "\n";
					lastLine = lastLine + charsPerLine;
				} else {
					outs.addSub(text,lastLine,lastSpace - lastLine);
					outs.b += "\n";
					lastLine = lastSpace + 1;
				}
				currentLine = i - lastLine;
				lastSpace = -1;
			}
			++currentLine;
			++i;
		}
		if(lastLine < len - 1) if(charsPerLine == null) outs.b += HxOverrides.substr(text,lastLine,null); else outs.b += HxOverrides.substr(text,lastLine,charsPerLine);
		return outs.b;
	}
};
Utils.intNoOverflow = function(f) {
	if(f >= 2147483647.0) return 2147483647; else if(f <= -2147483647.) return -1; else return f | 0;
};
Utils.floatToPrecisionString = function(f,precision,commas) {
	if(commas == null) commas = true;
	if(precision == null) precision = 5;
	var prefix = "";
	if(f < 0) {
		f *= -1;
		prefix = "-";
	}
	f = f * Math.pow(10,precision);
	var i = Math.round(f);
	if(i == 0 && f > 0.00000000001) {
		i = 1;
		if(prefix == "-") prefix = ">-"; else prefix = "<";
	}
	var s;
	if(i == null) s = "null"; else s = "" + i;
	if(s.length <= precision) s = Utils.intAsFixedString(i,precision + 1);
	var result = "";
	var j = s.length - precision;
	if(commas) {
		while(j > 3) {
			j -= 3;
			result = "," + HxOverrides.substr(s,j,3) + result;
		}
		result = s.substring(0,j) + result + "." + HxOverrides.substr(s,s.length - precision,null);
	} else result = HxOverrides.substr(s,0,s.length - precision) + "." + HxOverrides.substr(s,s.length - precision,null);
	return prefix + result;
};
Utils.floatToPercent = function(f,precision) {
	if(precision == null) precision = 5;
	return Utils.floatToPrecisionString(f * 100,precision,false) + "%";
};
Utils.mod = function(a,b) {
	return a - (a / b | 0) * b;
};
Utils.log2 = function(v) {
	var r = 0;
	while(v >= 31) {
		v >>= 4;
		r += 4;
	}
	while(v > 1) {
		v >>= 1;
		++r;
	}
	return r;
};
Utils.factorial = function(x) {
	var sign = 1;
	var r = 1;
	if(x < 0) {
		sign = -1;
		x *= -1;
	}
	while(x > 1) {
		r *= x;
		--x;
	}
	return r * sign;
};
var haxe = {};
haxe.Log = function() { };
haxe.Log.__name__ = true;
haxe.Log.trace = function(v,infos) {
	js.Boot.__trace(v,infos);
};
var js = {};
js.Boot = function() { };
js.Boot.__name__ = true;
js.Boot.__unhtml = function(s) {
	return s.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");
};
js.Boot.__trace = function(v,i) {
	var msg;
	if(i != null) msg = i.fileName + ":" + i.lineNumber + ": "; else msg = "";
	msg += js.Boot.__string_rec(v,"");
	if(i != null && i.customParams != null) {
		var _g = 0;
		var _g1 = i.customParams;
		while(_g < _g1.length) {
			var v1 = _g1[_g];
			++_g;
			msg += "," + js.Boot.__string_rec(v1,"");
		}
	}
	var d;
	if(typeof(document) != "undefined" && (d = document.getElementById("haxe:trace")) != null) d.innerHTML += js.Boot.__unhtml(msg) + "<br/>"; else if(typeof console != "undefined" && console.log != null) console.log(msg);
};
js.Boot.__string_rec = function(o,s) {
	if(o == null) return "null";
	if(s.length >= 5) return "<...>";
	var t = typeof(o);
	if(t == "function" && (o.__name__ || o.__ename__)) t = "object";
	switch(t) {
	case "object":
		if(o instanceof Array) {
			if(o.__enum__) {
				if(o.length == 2) return o[0];
				var str = o[0] + "(";
				s += "\t";
				var _g1 = 2;
				var _g = o.length;
				while(_g1 < _g) {
					var i = _g1++;
					if(i != 2) str += "," + js.Boot.__string_rec(o[i],s); else str += js.Boot.__string_rec(o[i],s);
				}
				return str + ")";
			}
			var l = o.length;
			var i1;
			var str1 = "[";
			s += "\t";
			var _g2 = 0;
			while(_g2 < l) {
				var i2 = _g2++;
				str1 += (i2 > 0?",":"") + js.Boot.__string_rec(o[i2],s);
			}
			str1 += "]";
			return str1;
		}
		var tostr;
		try {
			tostr = o.toString;
		} catch( e ) {
			return "???";
		}
		if(tostr != null && tostr != Object.toString) {
			var s2 = o.toString();
			if(s2 != "[object Object]") return s2;
		}
		var k = null;
		var str2 = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		for( var k in o ) {
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str2.length != 2) str2 += ", \n";
		str2 += s + k + " : " + js.Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str2 += "\n" + s + "}";
		return str2;
	case "function":
		return "<function>";
	case "string":
		return o;
	default:
		return String(o);
	}
};
Math.NaN = Number.NaN;
Math.NEGATIVE_INFINITY = Number.NEGATIVE_INFINITY;
Math.POSITIVE_INFINITY = Number.POSITIVE_INFINITY;
Math.isFinite = function(i) {
	return isFinite(i);
};
Math.isNaN = function(i1) {
	return isNaN(i1);
};
String.__name__ = true;
Array.__name__ = true;
Main.X = 22;
Utils.TWOPI = 6.28318530717958647693;
Main.main();
})(typeof window != "undefined" ? window : exports);
