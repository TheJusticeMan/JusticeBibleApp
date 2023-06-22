function ChekBx(id, title) {
	return '<SPAN ID=' + id + '><INPUT type="checkbox" ID=' + id + 'VL><SPAN class=checkboxspan ID=' + id + 'WD onclick="return document.all.' + id + 'VL.click();">' + title + '</SPAN></SPAN>';
}

function Radio(id, title) {
	title = title;
	var s = '<SPAN ID=' + id + '>';
	for (var i = 0; i < title.length; i++) {
		s += '<INPUT type="radio" ID=' + id + 'Rd name="' + title[i] + '" onclick="return RadeoSlip(\'' + id + 'Rd\');"><SPAN class=radiospan onclick="return document.all.' + id + 'Rd[' + i + '].click();">' + title[i] + '</SPAN><br>';
	}
	s += '</SPAN>';
	return s;
}

function RadeoSlip(Id) {
	Id = document.all[Id];
	for (var i = 0; i < Id.length; i++) {
		Id[i].checked = false;
	}
	event.srcElement.checked = true;
	event.srcElement.parentElement.name = event.srcElement.name;
}
