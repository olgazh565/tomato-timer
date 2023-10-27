import {addZero} from '../../helpers/helpers';

export class Tomato {
	static instance = null;

	constructor(
			work = 25,
			pause = 5,
			bigPause = 15,
			tasks = [],
	) {
		if (Tomato.instance) return Tomato.instance;

		Tomato.instance = this;
		this.work = work;
		this.pause = pause;
		this.bigPause = bigPause;
		this.timeLeft = this.work * 60;
		this.tasks = tasks;
		this.activeTask = null;
		this.timerId = null;
		this.count = 0;
		this.isActive = false;
		this.status = 'work';
	}

	addTask(task) {
		this.tasks.push(task);
	}

	setActiveTask(id) {
		const task = this.tasks.find(item => item.id === id);
		this.activeTask = task;
	}

	showTime(seconds) {
		const timer = document.querySelector('.window__timer-text');

		this.minutes = addZero(Math.floor(seconds / 60));
		this.seconds = addZero(seconds % 60);

		timer.textContent = `${this.minutes}:${this.seconds}`;
	}

	runTimer() {
		console.log('status', this.status);
		try {
			if (!this.activeTask) {
				throw new Error('Нет активной задачи, выберите задачу!');
			}

			this.timeLeft--;

			this.showTime(this.timeLeft);

			if (this.timeLeft > 0 && this.isActive) {
				this.timerId = setTimeout(this.runTimer.bind(this), 1000);
			}

			if (this.timeLeft <= 0) {
				if (this.status === 'work') {
					this.count++;
					this.activeTask.changeCount();
					this.status = this.count % 3 ? 'pause' : 'bigPause';

					console.log('count: ', this.count);
					console.log('activeTask.count: ', this.activeTask.count);
				} else {
					this.status = 'work';
				}
				this.timeLeft = this[this.status] * 60;
				this.runTaskTimer();
			}
		} catch (error) {
			alert(error.message);
		}
	}

	resetTimer() {
		try {
			if (!this.activeTask) {
				throw new Error('Нет активной задачи, выберите задачу!');
			}
			this.status = 'work';
			this.timeLeft = this[this.status] * 60;
			this.showTime(this.timeLeft);
			clearTimeout(this.timerId);
		} catch (error) {
			alert(error.message);
		}
	}

	setTaskCount(id) {
		const task = this.tasks.find(item => item.id === id);
		task.changeCount();
	}
}
