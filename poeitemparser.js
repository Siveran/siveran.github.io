function Reqs(strR, dexR, intR, ilevel) {
	this.strR = strR;
	this.dexR = dexR;
	this.intR = intR;
	this.ilevel = ilevel;
}

function Colors(R, G, B) {
	this.R = R;
	this.G = G;
	this.B = B;
}

function Item(r, c) {
	this.req = r;
	this.color = c;
}

function parseReqs(text) {
	var spl = text.split("<br>");
	var strR = 0;
	var dexR = 0;
	var intR = 0;
	var ilevel = 0;
	var s;
	var i;
	for (i in spl) {
		s = spl[i];
		if (s.substr(0,3) == "Str") {
			strR = parseInt(s.match(/[0-9]+/g), 10);
		}
		if (s.substr(0,3) == "Dex") {
			dexR = parseInt(s.match(/[0-9]+/g), 10);
		}
		if (s.substr(0,3) == "Int") {
			intR = parseInt(s.match(/[0-9]+/g), 10);
		}
		if (s.substr(0,11) == "Itemlevel: ") {
			ilevel = parseInt(s.match(/[0-9]+/g), 10);
		}
	}
	if (!(strR >= 0 && dexR >= 0 && intR >= 0 && ilevel >= 10)) {
		//console.log(strR + " " + dexR + " " + intR + " " + ilevel + " " + items.length);
		return false;
	}
	return new Reqs(strR, dexR, intR, ilevel);
}

function parseColors(text) {
	var spl = text.split("<br>");
	var red = 0;
	var green = 0;
	var blue = 0;
	var s;
	var i;
	var m;
	for (i in spl) {
		s = spl[i];
		if (s.substr(0,8) == "Sockets:") {
			red = /R/.test(s) ? s.match(/R/g).length : 0;
			green = /G/.test(s) ? s.match(/G/g).length : 0;
			blue = /B/.test(s) ? s.match(/B/g).length : 0;
		}
	}
	if (!(red >= 0 && green >= 0 && blue >= 0) || red + green + blue == 0) {
		//console.log(red + " " + green + " " + blue + " " + items.length);
		return false;
	}
	return new Colors(red, green, blue);
}

var items;
function toCSV(delim) {
	var it;
	var csv = "iLevel\tSTR\tDEX\tINT\tR\tG\tB\n";
	//console.log("iLevel,STR,DEX,INT,R,G,B");
	for (i in items) {
		it = items[i];
		//console.log(it.req.ilevel + delim + it.req.strR + delim + it.req.dexR + delim + it.req.intR + delim + it.color.R + delim + it.color.G + delim + it.color.B);
		csv += it.req.ilevel + delim + it.req.strR + delim + it.req.dexR + delim + it.req.intR + delim + it.color.R + delim + it.color.G + delim + it.color.B + "\n";
	}
	console.log(csv);
	window.prompt("Copy to clipboard: Ctrl+C, Enter", csv);
}

function munch() {
	var tb = document.body.children[3].children[0].children[0];
	var rows = tb.children;
	var req;
	var color;
	var i;
	var sockets;
	items = [];
	for (i = 0; i < rows.length; i++) {
		req = parseReqs(rows[i].children[5].innerHTML);
		color = parseColors(rows[i].children[5].innerHTML);
		if (req && color) items.push(new Item(req, color));
	}
	
	toCSV("\t");
}

munch();