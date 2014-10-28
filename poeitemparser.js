function Reqs(strR, dexR, intR, ilevel, baseitem) {
	this.strR = strR;
	this.dexR = dexR;
	this.intR = intR;
	this.ilevel = ilevel;
	this.baseitem = baseitem;
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
	var baseitem = "N/A";
	var s;
	var i;
	for (i in spl) {
		s = spl[i];
		if (i == 1) {
			baseitem = s.substr(0,s.length - 1);
		}
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
	return new Reqs(strR, dexR, intR, ilevel, baseitem);
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
	var csv = "Base\tiLevel\tSTR\tDEX\tINT\tR\tG\tB\n";
	//console.log("iLevel,STR,DEX,INT,R,G,B");
	for (i in items) {
		it = items[i];
		//console.log(it.req.ilevel + delim + it.req.strR + delim + it.req.dexR + delim + it.req.intR + delim + it.color.R + delim + it.color.G + delim + it.color.B);
		csv += it.req.baseitem + delim + it.req.ilevel + delim + it.req.strR + delim + it.req.dexR + delim + it.req.intR + delim + it.color.R + delim + it.color.G + delim + it.color.B + "\n";
	}
	console.log(csv);
	// Ugh this is messy, I'll come back and make things prettier later.
	var title = document.createElement("h3");
	title.appendChild(document.createTextNode("Copy This"));
	title.style.textAlign = "center";
	title.style.fontFamily = "Sans-serif, Arial"
	var ta = document.createElement("textarea");
	ta.appendChild(document.createTextNode(csv));
	var d = document.createElement("div");
	d.appendChild(title);
	d.appendChild(ta);
	d.style.width = "100%";
	d.style.position = "fixed";
	d.style.top = 0;
	ta.style.marginLeft = "30%";
	ta.style.marginRight = "30%";
	ta.style.width = "40%";
	ta.style.height = "700px";
	//ta.style.boxShadow = "box-shadow: 10px 10px 5px #888888";
	ta.select();
	document.children[0].children[1].appendChild(d);
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