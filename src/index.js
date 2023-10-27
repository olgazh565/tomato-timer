import './index.html';
import './index.scss';
import {Task} from './modules/Task/Task';
import {Tomato} from './modules/Tomato/Tomato';

let count = 0;
const imp = ['default', 'important', 'so-so'];
document.querySelector('.button-importance')
		.addEventListener('click', ({target}) => {
			count += 1;
			if (count >= imp.length) {
				count = 0;
			}

			for (let i = 0; i < imp.length; i++) {
				if (count === i) {
					target.classList.add(imp[i]);
				} else {
					target.classList.remove(imp[i]);
				}
			}
		});

const task = new Task('Сделать домашку');
console.log('task: ', task, task.id);

const task2 = new Task('Купить продукты');
console.log('task2: ', task2, task2.id);

const task3 = new Task('Сделать уборку');
console.log('task3: ', task3, task3.id);

const tomato = new Tomato();
console.log('tomato: ', tomato);

tomato.addTask(task);
tomato.addTask(task2);
tomato.addTask(task3);

tomato.setTaskCount(task.id);
tomato.setTaskCount(task.id);
tomato.setTaskCount(task2.id);

tomato.setActiveTask(task3.id);

const startBtn = document.querySelector('.button-primary');
const stopBtn = document.querySelector('.button-secondary');

startBtn.addEventListener('click', () => {
	tomato.isActive = true;
	tomato.runTimer();
	startBtn.disabled = true;
});

stopBtn.addEventListener('click', () => {
	tomato.isActive = false;
	startBtn.disabled = false;
	tomato.resetTimer();
});

