export class Task {
	#id;
	constructor(title, count = 0) {
		this.#id = Math.round(Math.random() * 1000);
		this.count = count;
		this.title = title;
	}

	get id() {
		return this.#id;
	}

	changeCount() {
		this.count += 1;
		return this;
	}
}

export class ImportantTask extends Task {
	constructor(title, count = 0, importance = 'important') {
		super(title, count = 0);
		this.importance = importance;
	}
}

export class DefaultTask extends Task {
	constructor(title, count = 0, importance = 'default') {
		super(title, count = 0);
		this.importance = importance;
	}
}

export class NotImportantTask extends Task {
	constructor(title, count = 0, importance = 'so-so') {
		super(title, count = 0);
		this.importance = importance;
	}
}


