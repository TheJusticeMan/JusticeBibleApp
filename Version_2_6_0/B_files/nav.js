var HtmlSearchBox, HtmlContent, HtmlNavButtons,
	HtmlBookSelector, HtmlChapSelector, HtmlVerseSelector,
	HtmlH1, HtmlH2, HtmlH3, HtmlSearchInput;
var VersVal, ChapVal, BookVal;
var booksOfTheBible;
var inSearch = false;
function Load() {
	document.getElementById("VerseMenu")
	HtmlBookSelector = document.getElementById("Books");
	HtmlChapSelector = document.getElementById("Chaps");
	HtmlVerseSelector = document.getElementById("Verses");
	HtmlSearchBox = document.getElementById("Search");
	HtmlNavButtons = document.getElementById("nav");
	HtmlContent = document.getElementById("contents");
	HtmlH1 = document.getElementById("BookNm");
	HtmlH2 = document.getElementById("BookHedr");
	HtmlH3 = document.getElementById("ChapNo");
	//prompt("",JSON.stringify(words));
	booksOfTheBible = ["GENESIS", "EXODUS", "LEVITICUS", "NUMBERS", "DEUTERONOMY", "JOSHUA", "JUDGES", "RUTH", "1 SAMUEL", "2 SAMUEL", "1 KINGS", "2 KINGS", "1 CHRONICLES", "2 CHRONICLES", "EZRA", "NEHEMIAH", "ESTHER", "JOB", "PSALMS", "PROVERBS", "ECCLESIASTES", "SONG SOLOMON", "ISAIAH", "JEREMIAH", "LAMENTATIONS", "EZEKIEL", "DANIEL", "HOSEA", "JOEL", "AMOS", "OBADIAH", "JONAH", "MICAH", "NAHUM", "HABAKKUK", "ZEPHANIAH", "HAGGAI", "ZECHARIAH", "MALACHI", "MATTHEW", "MARK", "LUKE", "JOHN", "ACTS", "ROMANS", "1 CORINTHIANS", "2 CORINTHIANS", "GALATIANS", "EPHESIANS", "PHILIPPIANS", "COLOSSIANS", "1 THESSALONIANS", "2 THESSALONIANS", "1 TIMOTHY", "2 TIMOTHY", "TITUS", "PHILEMON", "HEBREWS", "JAMES", "1 PETER", "2 PETER", "1 JOHN", "2 JOHN", "3 JOHN", "JUDE", "REVELATION"];
	for (var i = 0; i < booksOfTheBible.length; i++) {
		booksOfTheBible[booksOfTheBible[i]] = i;
	}
	var s = "";
	for (Book in Bible) {
		s += "<OPTION>" + Book + "</OPTION>";
	}
	HtmlBookSelector.innerHTML = s;
	HtmlBookSelector.onchange = HtmlBookSet;
	s = "";
	s += "<input id=searchBox><input type=button id=searchButton value='Search'><br>";
	s += "<div class=searchoptionscolumn>" + Radio("SearchType", ["Phrase", "Any word", "All words"]) + "</div>";
	s += "<div class=searchoptionscolumn>" + ChekBx("RegExpSearch", "Regular expressions") + "<br>";
	s += ChekBx("MatchCase", "Match Case") + "<br>";
	s += ChekBx("WholeWord", "Whole word") + "</div>";
	s += "<SPAN id=SearchHighLight></SPAN>";
	HtmlSearchBox.innerHTML = s;
	HtmlSearchInput = document.getElementById("searchBox");
	s = "";
	s += "<input type=button id=MainMenu  value=Menu>";
	s += "<input type=button id=BackHistory value=Back>";
	s += "<input type=button id=PrevChap    value=Prev>";
	s += "<input type=button id=NextChap    value=Next>";

	HtmlNavButtons.innerHTML = s;
	document.getElementById("NextChap").onclick = NextChap;
	document.getElementById("PrevChap").onclick = PrevChap;
	HtmlSearchInput.onkeyup = HighLightSearch;
	HtmlSearchInput.onkeydown = SearchPoss;
	document.getElementById("searchButton").onclick = DoSearch;
	document.getElementById("BackHistory").onclick = function () { History.pop(1) };
	HtmlSearchBox.style.display = "none"
	//document.getElementById("MainMenu").onclick =
	document.getElementById("MainMenu").onclick = ShowMenu;
	if (localStorage.Book) {
		History.push(new BibleRefShowChap(localStorage.Book, Number(localStorage.Chap), Number(localStorage.Verse)));
	} else {
		HtmlBookSet();
	}
	//alert(localStorage.Bookmarks);
	window.onbeforeunload = function (event) {
		localStorage.Bookmarks = JSON.stringify(Bookmarks);
		//return event.returnValue = "Are you sure you want to exit?";
		//event.preventDefault();
		//alert('Thanks for useing my app!');
	};
	Bookmarks = eval(localStorage.Bookmarks);
	if (!Array.isArray(Bookmarks)) Bookmarks = [];
	Bookmarks.forEach(function (value, index, array) { array[index]= new Bookmark(value.Book, value.Chap, value.Verse) });
	//addEventListener("beforeunload",function(event){event.preventDefault();return event.returnValue = "Are you sure you want to exit?";}, {capture: true});
}

function HtmlBookSet() {
	History.push(new BibleRefShowChap(booksOfTheBible[HtmlBookSelector.selectedIndex], 1, 0));
}
function HtmlChapSet() {
	History.push(new BibleRefShowChap(booksOfTheBible[HtmlBookSelector.selectedIndex], HtmlChapSelector.selectedIndex + 1, 0));
}
function HtmlVerseSet() {
	History.push(new BibleRefShowChap(booksOfTheBible[HtmlBookSelector.selectedIndex], HtmlChapSelector.selectedIndex + 1, HtmlVerseSelector.selectedIndex));
}

class BibleRefShowChap {
	constructor(Book, Chap, Verse) {
		this.Book = Book || "GENESIS";
		this.Chap = Chap || 1;
		this.Verse = Verse || 0;
		this.length = Bible[this.Book][this.Chap].length;
		this.ShowContent = SetHtmJs;
		this.toString = ChapToHtmString;
		//this.length = Bible[Book][Chap].length;
	}
}



function NextChap() {
	var TmpVerse = CurrentHistoryItem.Verse, TmpChap = CurrentHistoryItem.Chap, TmpBook = CurrentHistoryItem.Book
	TmpChap += 1;
	if (TmpChap > (Bible[TmpBook].length - 1)) {
		TmpChap = 0;
		if (booksOfTheBible[TmpBook] == 66) {
			return;
		} else {
			TmpBook = booksOfTheBible[booksOfTheBible[TmpBook] + 1];
		}
	}
	TmpVerse = 0;
	History.push(new BibleRefShowChap(TmpBook, TmpChap, TmpVerse));
}
function PrevChap() {
	var TmpVerse = CurrentHistoryItem.Verse, TmpChap = CurrentHistoryItem.Chap, TmpBook = CurrentHistoryItem.Book
	if (TmpChap == 1) {
		if (booksOfTheBible[TmpBook] == 0) {
			return;
		} else {
			TmpBook = booksOfTheBible[booksOfTheBible[TmpBook] - 1];
			TmpChap = Bible[TmpBook].length;
		}
	}
	TmpChap -= 1;
	TmpVerse = 0;
	History.push(new BibleRefShowChap(TmpBook, TmpChap, TmpVerse));
}


function GoToVerse(Book, Chap, Verse) {
	History.push(new BibleRefShowChap(Book, Chap, Verse));
}

function SetHtmJs() {
	var s = "";
	for (var i = 1; i < Bible[this.Book].length; i++) {
		s += "<OPTION>" + i + "</OPTION>";
	}
	HtmlChapSelector.innerHTML = s;
	s = "";
	for (var i = 0; i < Bible[this.Book][this.Chap].length; i++) {
		s += "<OPTION>" + (i + 1) + "</OPTION>";
	}
	HtmlVerseSelector.innerHTML = s;
	HtmlVerseSelector.selectedIndex = this.Verse;
	HtmlBookSelector.selectedIndex = booksOfTheBible[this.Book];
	HtmlChapSelector.selectedIndex = this.Chap - 1;
	ChangeContent(this.toString(), this.Book, Bible[this.Book][0], "CHAPTER " + (this.Chap));
	HtmlSearchBox.style.display = "none";
	if (this.Chap == 1) {
		document.getElementById("BookHead").style.display = ""
	} else {
		document.getElementById("BookHead").style.display = "none"
	}
	if (this.Verse != 0) {
		window.scrollTo(0, document.getElementById("contents").children[this.Verse].offsetTop - 100);
	} else {
		window.scrollTo(0, 0);
	}
	localStorage.Book = this.Book;
	localStorage.Chap = this.Chap;
	localStorage.Verse = this.Verse;
	HtmlBookSelector.onchange = HtmlBookSet;
	HtmlChapSelector.onchange = HtmlChapSet;
	HtmlVerseSelector.onchange = HtmlVerseSet;
}

function ChangeContent(Content, Header1, Header2, Header3) {
	HtmlH1.innerText = Header1;
	HtmlH2.innerText = Header2;
	HtmlH3.innerText = Header3;
	HtmlContent.innerHTML = Content;
}


function SetJsHtm() {
	GetPlace()
}

function ShowAll(Obj, DIV, stopAt) {
	if (stopAt) {
		var s = "";
		try {
			for (prop in Obj) {
				s += prop + "=";
				if (typeof (Obj[prop]) == "object") {
					s += "{" + ShowAll(Obj[prop], " ; ", stopAt - 1) + "}" + DIV;
				} else {
					s += "" + Obj[prop] + "" + DIV;
				}
			}
		} catch (e) { }
		return s;
	} else {
		return "Too Long:[Object]"
	}
}

