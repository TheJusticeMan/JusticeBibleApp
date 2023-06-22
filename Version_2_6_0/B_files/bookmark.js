var Bookmarks=[];
class Bookmark {
	constructor(Book, Chap, Verse) {
		this.Book = Book;
		this.Chap = Chap;
		this.Verse = Verse;
	}
	Show(){
		return this.Book;
	}
	toString(){
		return "<span class=SearchResult cite='#verse" + this.Verse + "' oncontextmenu='return ShowVerseMenu(" + ['"' + this.Book + '"', this.Chap, this.Verse] + ")' onclick='return GoToVerse(" + ['"' + this.Book + '"', this.Chap, this.Verse] + ")'><SPAN class=VerseNum>" + this.Book + " : " + this.Chap + ":" + (this.Verse + 1) + "</SPAN>  " + fixItal(Bible[this.Book][this.Chap][this.Verse]) + "</span>";
	}
}
function newBookmark(Book,Chap,Verse){
	Bookmarks.push(new Bookmark(Book,Chap,Verse));
}

/*function ShowBookmarks(){
	var PreShow="";
	ChangeContent(PreShow);
}*/

//alert((new Bookmark("GENISIS",1,1)).toString());

//Bookmarks
// 
