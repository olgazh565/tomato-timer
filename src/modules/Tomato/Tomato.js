import {addZero, declOfNum, showTimeTotal} from '../../helpers/helpers';
import {Task} from '../Task/Task';

export class Tomato {
	static instance = null;

	constructor(
			work = 25,
			pause = 5,
			bigPause = 15,
	) {
		if (Tomato.instance) return Tomato.instance;

		Tomato.instance = this;

		this.work = work;
		this.pause = pause;
		this.bigPause = bigPause;
		this.timeLeft = this.work * 60;
		this.tasks = this.getTasks();
		this.activeTask = null;
		this.timerId = null;
		this.count = this.getCount();
		this.isActive = false;
		this.status = 'work';

		this.resetCount();
	}

	// получаем общий счетчик из LS
	getCount() {
		const data = JSON.parse(localStorage.getItem('count'));
		if (!data) return 0;
		return data.count;
	}

	// сохраняем общий счетчик и текущую дату в LS
	setCount(count) {
		localStorage.setItem('count', JSON.stringify(
				{
					count, date: new Date().getTime(),
				},
		));
	}

	// получаем задачи из LS, создаем экземпляры класса Task на их основе
	getTasks() {
		const data = JSON.parse(localStorage.getItem('tasks'));
		if (!data) return [];

		const tasks = data.map(task => Object.assign(new Task(), task));
		return tasks;
	}

	// добавляем новую задачу в список задач
	addTask(task) {
		this.tasks.push(task);
	}

	// редактируем название задачи
	editTask(id, title) {
		const task = this.tasks.find(item => item.id === id);
		task.title = title;
	}

	// отображаем счетчик для активной задачи
	showActiveTaskCount(count) {
		const countElemPanel = document.querySelector('.window__panel-task-text');
		const countElemsTask = document.querySelectorAll('.count-number');

		const countElemTask = [...countElemsTask]
				.find(elem => elem.parentElement.id === this.activeTask.id);

		countElemPanel.textContent = `Томат ${count}`;
		countElemTask.textContent = count;
	}

	// записываем активную задачу
	setActiveTask(id) {
		const task = this.tasks.find(item => item.id === id);
		this.activeTask = task;

		return this.activeTask;
	}

	// показываем обратный отсчет времени
	showTime(seconds) {
		const minutesShow = addZero(Math.floor(seconds / 60));
		const secondsShow = addZero(seconds % 60);

		const timer = document.querySelector('.window__timer-text');
		timer.textContent = `${minutesShow}:${secondsShow}`;
	}

	// запускаем таймер
	runTimer() {
		console.log('status', this.status);
		try {
			if (!this.activeTask) {
				throw new Error('Нет активной задачи, выберите задачу!');
			}
			this.isActive = true;
			this.timeLeft -= 1;
			this.showTime(this.timeLeft);

			if (this.timeLeft > 0 && this.isActive) {
				this.timerId = setTimeout(this.runTimer.bind(this), 1000);
			}

			if (this.timeLeft <= 0) {
				if (this.status === 'work') {
					this.count++;
					this.setCount(this.count);
					this.activeTask.changeCount();
					this.showActiveTaskCount(this.activeTask.count);
					this.setTaskCount(this.activeTask.id, this.activeTask.count);
					this.updateTimeTotal();

					this.status = this.count % 3 ? 'pause' : 'bigPause';
				} else {
					this.status = 'work';
				}
				this.timeLeft = this[this.status] * 60;
				this.runTimer();
			}
		} catch (error) {
			alert(error.message);
		}
	}

	// сбрасываем текущий отсчет времени
	resetTimer() {
		try {
			if (!this.activeTask) {
				throw new Error('Нет активной задачи, выберите задачу!');
			}
			this.isActive = false;
			this.status = 'work';
			this.timeLeft = this[this.status] * 60;
			this.showTime(this.timeLeft);
			clearTimeout(this.timerId);
		} catch (error) {
			alert(error.message);
		}
	}

	// сбрасываем общий счетчик в полночь
	resetCount() {
		const data = JSON.parse(localStorage.getItem('count'));
		if (!data) return;

		const lsDate = new Date(data.date).setHours(0, 0, 0, 0);
		const currentDate = new Date().setHours(0, 0, 0, 0);

		if (currentDate > lsDate) {
			this.count = 0;
			this.setCount(this.count);
		}
	}

	// записываем счетчик активной задачи в LS
	setTaskCount(id, count) {
		const data = JSON.parse(localStorage.getItem('tasks'));
		const newData = data.map((item) => (
			item.id === id ?
				{
					...item,
					count,
				} : item
		));
		localStorage.setItem('tasks', JSON.stringify(newData));
	}

	// показываем общее временя работы за день
	updateTimeTotal() {
		const [hours, minutes] = showTimeTotal(this.count);

		const timeTotal = document.querySelector('.pomodoro-tasks__deadline-timer');
		timeTotal.textContent =
			`${hours} ${declOfNum(hours, ['час', 'часа', 'часов'])} ${minutes} минут`;
	}
}
