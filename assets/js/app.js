var adding_note_form = document.querySelector('form[name="adding-note"]'),
	adding_note_form_area = document.querySelector('#adding-note-area'),
	manage_notes_form = document.querySelector('form[name="manage-notes"]'),
	manage_notes_form_area = document.querySelector('#manage-notes-area'),
	notes_options_form = document.querySelector('form[name="notes-options"]'),
	notes_area = document.querySelector('section'),
	notes_array = [];

if(localStorage.getItem('notes')){
	notes_array = JSON.parse(localStorage.getItem('notes')).notes;
}else{
	localStorage.setItem('notes', JSON.stringify({'notes': []}));
	notes_array = JSON.parse(localStorage.getItem('notes')).notes;
}

function localStorageUpdate(array){
	localStorage.setItem('notes', JSON.stringify({'notes': array}));
	displayAllNotes();
}

function closeFormArea(element){
	if(element)
		element.classList.remove('form-area--visible');

	window.addEventListener('click', function(e){
		if(e.target.classList.value === "form-area form-area--visible")
			e.target.classList.remove('form-area--visible');
	});
}

function deleteAllNotes(){
	notes_array = [];
	localStorageUpdate(notes_array);
}

function displayAllNotes(){
	notes_area.innerHTML = '';

	if(notes_array.length){
		var html_all_notes = document.createDocumentFragment();

		for(var i=0; i<notes_array.length; i++)
			html_all_notes.appendChild(makeNoteHmtl(notes_array[i], i, notes_array[i].condition));

		notes_area.appendChild(html_all_notes);
	}
}

function makeNoteHmtl(data, id, condition){
	var fragment = document.createDocumentFragment(),
		note = document.createElement('article'),
		title = document.createElement('h3'),
		content = document.createElement('p'),
		form = document.createElement('form'),
		button_check = document.createElement('input'),
		button_delete = document.createElement('input');

	note.classList.value = 'section__note';
	if(condition)
		note.classList.add('section__note--checked');
	note.id = id;
	title.innerHTML = data.title;
	content.innerHTML = data.content;
	form.classList.value = 'section__note__options';
	form.setAttribute('name', 'note-options');

	button_check.setAttribute('type', 'button');
	button_check.name = 'check_note';
	button_check.value = 'zmień stan notatki';
	button_check.classList.value = 'button section__note__options__item section__note__options__item--check';
	
	button_delete.setAttribute('type', 'button');
	button_delete.name = 'delete_note';
	button_delete.value = 'usuń notatkę';
	button_delete.classList.value = 'button section__note__options__item section__note__options__item--delete';

	fragment.appendChild(note);
	form.appendChild(button_check);
	form.appendChild(button_delete);
	note.appendChild(title);
	note.appendChild(content);
	note.appendChild(form);

	return fragment;
}

function addNote(){

	adding_note_form.title.classList.remove('error');
	adding_note_form.content.classList.remove('error');

	var	title = '',
		content = '',
		note;

	if(adding_note_form.title.value === '' && adding_note_form.content.value === ''){
		adding_note_form.title.classList.add('error');
		adding_note_form.content.classList.add('error');
	}
	else if(adding_note_form.title.value === ''){
		adding_note_form.title.classList.add('error');
	}
	else if(adding_note_form.content.value === ''){
		adding_note_form.content.classList.add('error');
	}
	else{
		title = adding_note_form.title.value;
		content = adding_note_form.content.value;
		note = {title: title, content: content, condition: 0}

		adding_note_form_area.classList.remove('form-area--visible');
		notes_array.unshift(note);
		localStorageUpdate(notes_array);
	}
}

function deleteNote(id){
	notes_array.splice(id, 1);
	localStorageUpdate(notes_array);
}

function checkNote(id){
	if(notes_array[id].condition === 0)
		notes_array[id].condition = 1;
	else
		notes_array[id].condition = 0;

	localStorageUpdate(notes_array);
}

window.addEventListener('DOMContentLoaded', displayAllNotes);

notes_options_form.addEventListener('click', function(e){
	if(e.target.name === 'add'){
		adding_note_form.title.value = '';
		adding_note_form.content.value = '';
		adding_note_form_area.classList.add('form-area--visible');
		closeFormArea();
	}
	else if(e.target.name === 'manage'){
		manage_notes_form_area.classList.add('form-area--visible');
		closeFormArea();
	}
});

adding_note_form.submit.addEventListener('click', addNote);

manage_notes_form.addEventListener('click', function(e){
	if(e.target.name === 'delete_notes'){
		deleteAllNotes();
		closeFormArea(manage_notes_form_area);
	}
});

notes_area.addEventListener('click', function(e){
	if(e.target.name === 'delete_note'){
		deleteNote(e.target.parentNode.parentNode.id);
	}
	else if(e.target.name === 'check_note'){
		checkNote(e.target.parentNode.parentNode.id);
	}
});