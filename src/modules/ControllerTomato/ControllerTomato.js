export class ControllerTomato {
	getLocalStorage() {
		return JSON.parse(localStorage.getItem('tasks')) || [];
	}

	setLocalStorage(item) {
		this.data = this.getLocalStorage();
		this.data.push(item);

		localStorage.setItem('tasks', JSON.stringify(this.data));
	}

	removeLocalStorage(id) {
		this.data = this.getLocalStorage();
		console.log('this.data: ', this.data);

		const newData = this.data.filter(item => item.id !== id);
		console.log('newData: ', newData);
		localStorage.setItem('tasks', JSON.stringify(newData));
	}

	editLocalStorage = (id, title) => {
		this.data = this.getLocalStorage();
		const newData = this.data.map((item) => (
			item.id === id ?
				{
					...item,
					title,
				} : item
		));
		localStorage.setItem('tasks', JSON.stringify(newData));
	};
}
