var Bookmarks
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
        return JSON.stringify(this);
    }
}
//alert((new Bookmark("GENISIS",1,1)).toString());