import {addZero, declOfNum} from '../../helpers/helpers';
import {DefaultTask, ImportantTask, NotImportantTask} from '../Task/Task';
import {Tomato} from '../Tomato/Tomato';

export class ControllerTomato {
	constructor() {
		this.tomato = new Tomato();
	}

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

		const newData = this.data.filter(item => item.id !== id);

		localStorage.setItem('tasks', JSON.stringify(newData));
	}

	editLocalStorage(id, title) {
		this.data = this.getLocalStorage();
		const newData = this.data.map((item) => (
			item.id === id ?
				{
					...item,
					title,
				} : item
		));
		localStorage.setItem('tasks', JSON.stringify(newData));
	}

	// показываем общее временя работы за день
	updateTimeTotal() {
		const time = this.tomato.count * 25;

		const hours = Math.floor(time / 60);
		const minutes = time % 60;

		const timeTotal = document.querySelector('.pomodoro-tasks__deadline-timer');
		if (timeTotal) {
			timeTotal.textContent =
				`${hours} ${declOfNum(hours, ['час', 'часа', 'часов'])} ${minutes} минут`;
		}
		return [hours, minutes];
	}

	// отображаем счетчик для активной задачи
	showActiveTaskCount(count, id) {
		const countElemPanel = document.querySelector('.window__panel-task-text');
		const countElemsTask = document.querySelectorAll('.count-number');

		const countElemTask = [...countElemsTask]
				.find(elem => elem.parentElement.id === id);

		countElemPanel.textContent = `Томат ${count}`;
		countElemTask.textContent = count;
	}

	// показываем обратный отсчет времени
	showTime(seconds) {
		const minutesShow = addZero(Math.floor(seconds / 60));
		const secondsShow = addZero(seconds % 60);

		const timer = document.querySelector('.window__timer-text');
		timer.textContent = `${minutesShow}:${secondsShow}`;
	}

	// запускаем таймер
	handleRunTimer() {
		if (this.tomato.isActive) return;
		this.tomato.runTimer();
	}

	// сбрасываем таймер
	handleResetTimer() {
		this.tomato.resetTimer();
	}

	// выбираем активный таск
	handleActiveTask(target) {
		const taskName = target.closest('.pomodoro-tasks__task-text');
		const task = target.closest('.pomodoro-tasks__list-task');

		if (this.tomato.isActive && task.id !== this.tomato.activeTask?.id) {
			this.tomato.resetTimer();
		}

		if (taskName) {
			const currentActiveTask =
					document.querySelector('.pomodoro-tasks__task-text_active');
			currentActiveTask?.classList.remove('pomodoro-tasks__task-text_active');

			target.classList.add('pomodoro-tasks__task-text_active');

			const newActiveTask = this.tomato.setActiveTask(task.id);

			return newActiveTask;
		}
	}

	// добавляем новый таск
	handleFormSubmit(form, importance) {
		if (!form.title.value.length) return;

		let Task;
		switch (importance) {
			case 'important':
				Task = ImportantTask;
				break;
			case 'so-so':
				Task = NotImportantTask;
				break;
			default:
				Task = DefaultTask;
				break;
		}

		const newTask = new Task(form.title.value);

		this.setLocalStorage(newTask);
		this.tomato.addTask(newTask);

		return newTask;
	}

	// удаляем таск
	handleDeleteTask(target) {
		if (target.closest('.modal-delete__delete-button')) {
			const tasks = document.querySelectorAll('.pomodoro-tasks__list-task');

			const task = [...tasks]
					.find(el => el.id === target.closest('.modal-overlay').dataset.id);

			this.removeLocalStorage(task.id);
			task.remove();

			if (task.id === this.tomato.activeTask?.id && this.tomato.isActive) {
				this.tomato.resetTimer();
				this.tomato.activeTask = null;

				return 'running task deleted';
			}
		}
	}

	// редактируем название таска
	handleEditTaskName(target) {
		const task = target.closest('.pomodoro-tasks__list-task');

		if (target.getAttribute('contenteditable')) {
			target.setAttribute('contenteditable', 'false');
			target.tabIndex = '';

			this.editLocalStorage(task.id, target.textContent);
			this.tomato.editTask(task.id, target.textContent);

			if (task.id === this.tomato.activeTask?.id) {
				const taskNamePanel = document.querySelector('.window__panel-title');
				taskNamePanel.textContent = target.textContent;
			}
		}
	}
}
