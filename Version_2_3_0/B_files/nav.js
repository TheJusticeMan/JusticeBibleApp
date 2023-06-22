var VersVal, ChapVal, BookVal;
var booksOfTheBible;
var inSearch = false;
function Load() {
	//prompt("",JSON.stringify(words));
	booksOfTheBible = ["GENESIS", "EXODUS", "LEVITICUS", "NUMBERS", "DEUTERONOMY", "JOSHUA", "JUDGES", "RUTH", "1 SAMUEL", "2 SAMUEL", "1 KINGS", "2 KINGS", "1 CHRONICLES", "2 CHRONICLES", "EZRA", "NEHEMIAH", "ESTHER", "JOB", "PSALMS", "PROVERBS", "ECCLESIASTES", "SONG SOLOMON", "ISAIAH", "JEREMIAH", "LAMENTATIONS", "EZEKIEL", "DANIEL", "HOSEA", "JOEL", "AMOS", "OBADIAH", "JONAH", "MICAH", "NAHUM", "HABAKKUK", "ZEPHANIAH", "HAGGAI", "ZECHARIAH", "MALACHI", "MATTHEW", "MARK", "LUKE", "JOHN", "ACTS", "ROMANS", "1 CORINTHIANS", "2 CORINTHIANS", "GALATIANS", "EPHESIANS", "PHILIPPIANS", "COLOSSIANS", "1 THESSALONIANS", "2 THESSALONIANS", "1 TIMOTHY", "2 TIMOTHY", "TITUS", "PHILEMON", "HEBREWS", "JAMES", "1 PETER", "2 PETER", "1 JOHN", "2 JOHN", "3 JOHN", "JUDE", "REVELATION"];
	for (var i = 0; i < booksOfTheBible.length; i++) {
		booksOfTheBible[booksOfTheBible[i]] = i;
	}
	var s = "<SELECT ID=Books>";
	for (Book in Bible) {
		s += "<OPTION>" + Book + "</OPTION>";
	}
	s += "</SELECT>";
	document.all.Books.outerHTML = s;
	document.all.Books.onchange = HtmlBookSet;
	s = "";
	s += "<input id=searchBox><input type=button id=searchButton value='Search'><br>";
	s += "<div class=searchoptionscolumn>" + Radio("SearchType", ["Phrase", "Any word","All words"]) + "</div>";
	s += "<div class=searchoptionscolumn>" + ChekBx("RegExpSearch", "Regular expressions") + "<br>";
	s += ChekBx("MatchCase", "Match Case") + "<br>";
	s += ChekBx("WholeWord", "Whole word") + "</div>";
	s += "<SPAN id=SearchHighLight></SPAN>";
	document.all.nav.innerHTML = "<input Type=Button id=OpenSearch Value=Search><input type=button id=BackHistory value='Back'><input type=button id=PrevChap value=Prev><input type=button  id=NextChap value=Next>";
	document.all.NextChap.onclick = NextChap;
	document.all.PrevChap.onclick = PrevChap;
	document.all.Search.innerHTML = s;
	document.all.SearchTypeRd[0].click();
	document.all.searchBox.onkeyup = HighLightSearch;
	document.all.searchBox.onkeydown = SearchPoss;
	document.all.searchButton.onclick = DoSearch;
	document.all.BackHistory.onclick = function () { History.pop(1) };
	document.all.Search.style.display = "none"
	document.all.OpenSearch.onclick = function () {
		inSearch = true;
		document.all.Search.style.display = ""
	};
	HtmlBookSet();
}

function HtmlBookSet(){
	History.push(new BibleRefShowChap(booksOfTheBible[document.all.Books.selectedIndex],1, 0));
}
function HtmlChapSet(){
	History.push(new BibleRefShowChap(booksOfTheBible[document.all.Books.selectedIndex],document.all.Chaps.selectedIndex + 1, 0));
}
function HtmlVerseSet(){
	History.push(new BibleRefShowChap(booksOfTheBible[document.all.Books.selectedIndex],document.all.Chaps.selectedIndex + 1, document.all.Verses.selectedIndex));
}

function BibleRefShowChap(Book,Chap,Verse){
	this.Book = Book || "GENESIS";
	this.Chap = Chap || 1;
	this.Verse = Verse || 0;
	this.length = Bible[this.Book][this.Chap].length;
	this.ShowContent=SetHtmJs;
	this.toString = ChapToHtmString;
	//this.length = Bible[Book][Chap].length;
}



function NextChap() {
	var TmpVerse=CurrentHistoryItem.Verse,TmpChap=CurrentHistoryItem.Chap,TmpBook=CurrentHistoryItem.Book
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
	var TmpVerse=CurrentHistoryItem.Verse,TmpChap=CurrentHistoryItem.Chap,TmpBook=CurrentHistoryItem.Book
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

function SetHtmJs(){
	var s = "<SELECT ID=Chaps>";
	for (var i = 1; i < Bible[this.Book].length; i++) {
		s += "<OPTION>" + i + "</OPTION>";
	}
	s += "</SELECT>";
	document.all.Chaps.outerHTML = s;
	s = "<SELECT ID=Verses>";
	for (var i = 0; i < Bible[this.Book][this.Chap].length; i++) {
		s += "<OPTION>" + (i + 1) + "</OPTION>";
	}
	s += "</SELECT>";
	document.all.Verses.outerHTML = s;
	document.all.Verses.selectedIndex = this.Verse;
	document.all.Books.selectedIndex = booksOfTheBible[this.Book];
	document.all.Chaps.selectedIndex = this.Chap - 1;
	document.all.BookNm.innerText = this.Book;
	document.all.BookHedr.innerText = Bible[this.Book][0];
	document.all.ChapNo.innerText = "CHAPTER " + (this.Chap);
	document.all.contents.innerHTML = this.toString();
	document.all.Search.style.display = "none"
	if (this.Chap == 1) {
		document.all.BookHead.style.display = ""
	} else {
		document.all.BookHead.style.display = "none"
	}
	if (this.Verse != 0) {
		window.scrollTo(0, document.all.verse[this.Verse].offsetTop - 100);
	} else {
		window.scrollTo(0, 0);
	}
	document.all.Books.onchange = HtmlBookSet;
	document.all.Chaps.onchange = HtmlChapSet;
	document.all.Verses.onchange = HtmlVerseSet;
}

function SetJsHtm(){
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

