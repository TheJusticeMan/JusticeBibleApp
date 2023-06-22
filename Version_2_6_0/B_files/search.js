//var Word=/("[^"]+"|'[^']+'|[^ ]*[a-zA-Z_]+[^ ]*)/g;
const Word = /("[^"]+"|'[^']+'|[^ ]*[a-zA-Z_]+[^ ]*)/g;
const nWord = /[^"]*?(?=[^ ]*[a-zA-Z_]+[^ ]*|"[^"]+"|'[^']+')/g;
const DRegExp = /([](\\\.)?^$|\*\+{}[])/g;
var RegExpOn = false;
var UseWholeWords = true;
var ready = false;
var SearchText;
var tags;
var SearchFor;
var SearchType = "";//"Phrase", "Any word","All words"

function DoSearch() {
	document.getElementById("BookHead").style.display = "none"
	HtmlSearchBox.style.display = "none"
	if (!ready)
		GetSearch();
	if (SearchType == "Phrase") {
		if (!RegExpOn)
			SearchFor = SearchFor.replace(DRegExp, "\\$1");
		if (UseWholeWords)
			SearchFor = "\\b" + SearchFor + "\\b";
		SearchFor = new RegExp(SearchFor, tags);
	} else {
		SearchFor = new LogicalSearch(SearchFor, tags);
	}
	//alert("Got Past Create!"+SearchFor.test);
	var MyFound = [];
	var NoMatches = 0;
	for (Book in BibleSearch) {     //Books
		if (SearchFor.test(BibleSearch[Book].toString()) > 0) {     //Book
			//window.status = NoMatches + ":  " + Book;
			for (var C = 1; C < BibleSearch[Book].length; C++) {     //Chaps
				if (SearchFor.test(BibleSearch[Book][C].toString()) > 0) {
					for (var V = 0; V < BibleSearch[Book][C].length; V++) {     //Verse
						if (SearchFor.test(BibleSearch[Book][C][V].toString()) > 0) {
							MyFound.push(new BibleRefOld(Book, C, V, BibleReftoSearchString, SearchFor.test(BibleSearch[Book][C][V].toString())));
							NoMatches++;
						}
					}
				}
			}
		}
	}
	MyFound.sort(SortSearch)
	window.status = NoMatches;
	//prompt(MyFound,MyFound)
	var ShowResults = true;
	if (NoMatches > 999) {
		ShowResults = confirm("Many matches might crash computer:  " + NoMatches + " were found.  Preparing to show them.");
	}
	var Obj = new Object();
	Obj.content = MyFound;
	Obj.ShowContent = function () {
		//return this.content.join("");
		document.getElementById("BookNm").innerText = "";
		document.getElementById("BookHedr").innerText = "";
		document.getElementById("ChapNo").innerText = "";
		document.getElementById("contents").innerHTML = this.content.join("");
	}
	if (ShowResults)
		History.push(Obj);
	window.scrollTo(0, 0);
	//document.getElementById("status").style.top=document.body.scrollTop;
	//document.getElementById("alll").onscroll()
	//document.getElementById("contents").innerHTML=MyFound.toString();//.replace(/\r\n/g,"<BR>");
	ready = false;
}

function FindSimilar(Book, Chap, Verse) {
	closeNav();
	BookVal = "";
	//SearchText=Bible[BookVal].toString();
	tags = "";
	SearchFor = "";
	var searchin = Bible[Book][Chap][Verse].toLowerCase().split(/\W/g);
	searchin = searchin.sort();
	var lastWord = "";
	var a = [];
	var s = "";
	var currnum = 0;
	var sum = 0;
	for (var i = 0; i < searchin.length; i++) {
		if (searchin[i] != lastWord) {
			currnum = Math.round(256 / words[searchin[i]]);
			currnum = currnum || 0;
			sum += currnum;
			if (currnum != 0) {
				a.push("( " + searchin[i] + " * " + currnum + " )");
			}
		}
		lastWord = searchin[i];
	}
	s = a.join(" + ") + " - " + (sum / 4)
	//alert(s);
	HtmlSearchInput.value = s;
	//searchin=se
	RegExpOn = false;
	tags = "i";
	//alert(searchin);
	SearchType = "Any word";
	UseWholeWords = true;
	event.returnValue = false;
	ready = true;
	SearchFor = s;
	DoSearch();
}

function GetSearch() {
	BookVal = document.all.Books[document.getElementById("Books").selectedIndex].innerText;
	SearchFor = HtmlSearchInput.value;
	RegExpOn = false;
	UseWholeWords = false;
	tags = "";
	if (document.getElementById("RegExpSearch").checked) RegExpOn = true;
	if (document.getElementById("WholeWord").checked) UseWholeWords = true;
	if (!document.getElementById("MatchCase").checked) tags = "i";
	SearchType = document.querySelector('input[name="SearchType"]:checked').value;
	//alert(SearchType);
}

function LogicalSearch(Find, flags) {
	const DoubleWd = /this\.WdList\[i\+\+\]\.test\(s\)[ ]+this\.WdList\[i\+\+\]\.test\(s\)/g;
	this.Find = Find;
	this.WdList = Find.match(Word);
	var LogiTests = "";
	if (SearchType == "All words") {
		LogiTests = "this.WdList[i++].test(s)";
		for (var i = 1; i < this.WdList.length; i++) {
			LogiTests += " && this.WdList[i++].test(s)";
		}
	} else {
		LogiTests = Find.replace(Word, "this.WdList[i++].test(s)");
		while ((DoubleWd).test(LogiTests)) {
			LogiTests = LogiTests.replace(DoubleWd, "this.WdList[i++].test(s) + this.WdList[i++].test(s)");
		}
	}
	try {
		for (var i = 0; i < this.WdList.length; i++) {
			var s=this.WdList[i].toString();
			if (s.charAt(0) == '"' || s.charAt(0) == "'") {
				s = s.substring(1, s.length - 1);
			}
			if (!RegExpOn)
				s = s.replace(DRegExp, "\\$1");
			else
				s = s;
			if (UseWholeWords) {
				s = "\\b" + s + "\\b";
			}
			this.WdList[i] = RegExp(s, flags);
			this.WdList[i].compile(s, flags);
		}
	} catch (e) {
		alert("Search error:  " + e.description);
		this.test = function test(s) { return false };
	}
	var Temp = "this.test=function test(s){";
	Temp += "var i=0;";
	Temp += "return (" + LogiTests + ");";
	Temp += "}";
	try {
		eval(Temp);
	} catch (e) {
		prompt("Search error:  " + e.description + "\r\n" + Temp, "Search error:  " + e.description + "\r\n" + Temp);

		this.test = function test(s) { return false };
	}
	this.toString = function ToString() { return this.Find };
}

function SortSearch(r1, r2) {
	return r2.index - r1.index
}

function SearchPoss() {
	if (event.keyCode == 13) {
		HtmlSearchInput.value = HtmlSearchInput.value.replace(/[\r\n]/g, " ");
		if (HtmlSearchInput.value.length >= 1) {
			document.getElementById("searchButton").click();
			HtmlSearchBox.style.display = "none"
		}
	}
}

function HighLightSearch() {
	if (event.keyCode != 13) {
		var s = "";
		//document.getElementById("contents").innerText=ShowAll(event,"\r\n",1);
		s = event.srcElement.value;
		s = s.replace(Word, "<SPAN class=does>$1</SPAN>");
		document.getElementById("SearchHighLight").innerHTML = s;
	}
}

