export class Task {
	constructor(title, count = 0) {
		this.id = Math.random().toString().slice(2, 10);
		this.title = title;
		this.count = count;
	}

	changeCount() {
		this.count += 1;
		return this.count;
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


