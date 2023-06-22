var Bookmarks = [];
class Bookmark {
	constructor(Book, Chap, Verse) {
		this.Book = Book;
		this.Chap = Chap;
		this.Verse = Verse;
	}
	Show() {
		return this.Book;
	}
	Element() {   //cast as a HTML search Element
		var Cbible = document.createElement("span");
		Cbible.className = "SearchResult";
		Cbible.dataset.Book = this.Book;  //store some values in the HTML DOM for recall by event handlers
		Cbible.dataset.Chap = this.Chap;
		Cbible.dataset.Verse = this.Verse;
		Cbible.oncontextmenu = ShowThisVerseMenu;
		Cbible.onclick = GoToThisVerse;
		Cbible.innerHTML = "<SPAN class=VerseNum>" + this.Book + " : " + this.Chap + ":" + (this.Verse + 1) + "</SPAN>  " + fixItal(Bible[this.Book][this.Chap][this.Verse]);
		return Cbible;
	}
	//toString() {
	//	return "<span class=SearchResult cite='#verse" + this.Verse + "' oncontextmenu='return ShowVerseMenu(" + ['"' + this.Book + '"', this.Chap, this.Verse] + ")' onclick='return GoToVerse(" + ['"' + this.Book + '"', this.Chap, this.Verse] + ")'><SPAN class=VerseNum>" + this.Book + " : " + this.Chap + ":" + (this.Verse + 1) + "</SPAN>  " + fixItal(Bible[this.Book][this.Chap][this.Verse]) + "</span>";
	//}
}
function newBookmark(Book, Chap, Verse) {
	Bookmarks.push(new Bookmark(Book, Chap, Verse));
}

/*function ShowBookmarks(){
	var PreShow="";
	ChangeContent(PreShow);
}*/

//alert((new Bookmark("GENISIS",1,1)).toString());

//Bookmarks
// 
