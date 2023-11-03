import {createElement, declOfNum} from '../../helpers/helpers';
import {ControllerTomato} from '../ControllerTomato/ControllerTomato';

export class RenderTomato {
	constructor() {
		this.controller = new ControllerTomato();

		this.main = createElement('main', {
		});
		this.section = createElement('section', {
			className: 'main',
		});
		this.container = createElement('div', {
			className: 'container main__container',
		});
		this.formWindow = createElement('div', {
			className: 'pomodoro-form window',
		});
		this.pomodoroTasks = createElement('div', {
			className: 'pomodoro-tasks',
		});
		this.windowPanel = createElement('div', {
			className: 'window__panel',
		});

		this.container.append(this.formWindow, this.pomodoroTasks);
		this.section.append(this.container);
		this.main.append(this.section);
		document.body.append(this.main);

		this.init();
	}

	init() {
		this.renderHeader();
		this.renderModal();
		this.renderActiveTask({});
		this.renderTimer();
		this.renderForm();
		this.addHTML();
		this.renderTasks();
		this.renderTimeTotal();
		this.setActiveTask();
		this.deleteTask();
		this.editTask();
		this.setTaskPriority();
	}

	// отрисовываем активную задачу и ее счетчик
	renderActiveTask({title = 'Выберите задачу', count = 0}) {
		this.windowPanel.innerHTML = '';

		this.taskTitle = createElement('p', {
			className: 'window__panel-title',
			textContent: title,
		});

		const taskCount = createElement('p', {
			className: 'window__panel-task-text',
			textContent: `Томат ${count}`,
		});

		this.windowPanel.append(this.taskTitle, taskCount);
		this.formWindow.prepend(this.windowPanel);
	}

	// отрисовываем таймер
	renderTimer() {
		const windowBody = createElement('div', {
			className: 'window__body',
		});
		this.timer = createElement('p', {
			className: 'window__timer-text',
			textContent: '25:00',
		});
		const timerBtns = createElement('div', {
			className: 'window__buttons',
		});
		const startBtn = createElement('button', {
			className: 'button button-primary',
			textContent: 'Старт',
			type: 'button',
		});
		const stopBtn = createElement('button', {
			className: 'button button-secondary',
			textContent: 'Стоп',
			type: 'button',
		});

		startBtn.addEventListener('click', () => {
			this.controller.handleRunTimer();
		});

		stopBtn.addEventListener('click', () => {
			this.controller.handleResetTimer();
		});

		timerBtns.append(startBtn, stopBtn);
		windowBody.append(this.timer, timerBtns);
		this.formWindow.append(windowBody);
	}

	// отрисовываем форму добавления задач
	renderForm() {
		const form = createElement('form', {
			className: 'task-form',
			action: 'submit',
		});
		const input = createElement('input', {
			className: 'task-name input-primary',
			type: 'text',
			name: 'title',
			id: 'task-name',
			placeholder: 'название задачи',
		});
		this.importanceBtn = createElement('button', {
			className: 'button button-importance default',
			type: 'button',
			ariaLlabel: 'Указать важность',
		});
		this.importanceBtn.dataset.importance = 'default';

		const addBtn = createElement('button', {
			className: 'button button-primary task-form__add-button',
			type: 'submit',
			textContent: 'Добавить',
		});

		form.append(input, this.importanceBtn, addBtn);
		this.formWindow.append(form);

		form.addEventListener('submit', (e) => {
			e.preventDefault();

			const newTask = this.controller.handleFormSubmit(
					form,
					this.importanceBtn.dataset.importance,
			);

			this.renderTask(newTask);
			form.reset();
		});
	}

	// устанавливаем важность задачи при ее создании
	setTaskPriority() {
		let count = 0;
		const options = ['default', 'important', 'so-so'];

		this.importanceBtn.addEventListener('click', ({target}) => {
			count += 1;
			if (count >= options.length) {
				count = 0;
			}

			for (let i = 0; i < options.length; i++) {
				if (count === i) {
					target.classList.add(options[i]);
					target.dataset.importance = options[i];
				} else {
					target.classList.remove(options[i]);
				}
			}
		});
	}

	// отрисовываем задачи из LS
	renderTasks() {
		const data = this.controller.getLocalStorage();

		this.tasksList = createElement('ul', {
			className: 'pomodoro-tasks__quest-tasks',
		});

		this.pomodoroTasks.append(this.tasksList);

		if (!data.length) return;

		data.map(item => this.tasksList.append(this.createTask(item)));
	}

	// добавляем новый таск
	renderTask(item) {
		this.tasksList.append(this.createTask(item));
	}

	// создаем новый таск
	createTask(item) {
		const taskItem = createElement('li', {
			className: `pomodoro-tasks__list-task ${item.importance}`,
			id: item.id,
		});
		const countNumber = createElement('span', {
			className: 'count-number',
			textContent: item.count,
		});
		const taskNameBtn = createElement('button', {
			className: 'pomodoro-tasks__task-text',
			type: 'button',
		});
		const taskName = createElement('span', {
			textContent: item.title,
		});
		taskNameBtn.append(taskName);

		taskNameBtn.addEventListener('focusout', ({target}) => {
			this.controller.handleEditTaskName(target);
		});

		const taskBtn = createElement('button', {
			className: 'pomodoro-tasks__task-button',
			type: 'button',
		});
		const popup = createElement('div', {
			className: 'burger-popup',
		});

		taskBtn.addEventListener('click', () => {
			popup.classList.toggle('burger-popup_active');
		});

		const popupEditBtn = createElement('button', {
			className: 'popup-button burger-popup__edit-button',
			type: 'button',
			textContent: 'Редактировать',
		});

		const popupDeleteBtn = createElement('button', {
			className: 'popup-button burger-popup__delete-button',
			type: 'button',
			textContent: 'Удалить',
		});

		popup.append(popupEditBtn, popupDeleteBtn);
		taskItem.append(countNumber, taskNameBtn, taskBtn, popup);

		return taskItem;
	}

	// удаляем таск
	deleteTask() {
		this.tasksList.addEventListener('click', ({target}) => {
			const deleteBtn = target.closest('.burger-popup__delete-button');

			if (deleteBtn) {
				const task = target.closest('.pomodoro-tasks__list-task');

				this.modalOverlay.style.display = 'block';
				this.modalOverlay.dataset.id = task.id;
			}
		});
	}

	// редактируем название задачи
	editTask() {
		this.tasksList.addEventListener('click', ({target}) => {
			const editBtn = target.closest('.burger-popup__edit-button');

			if (editBtn) {
				const task = target.closest('.pomodoro-tasks__list-task');
				const taskName = task.querySelector('.pomodoro-tasks__task-text span');

				taskName.setAttribute('contenteditable', 'true');
				taskName.tabIndex = 0;
				taskName.focus();
			}
		});
	}

	// выбираем активную задачу
	setActiveTask() {
		this.tasksList.addEventListener('click', ({target}) => {
			const newActiveTask = this.controller.handleActiveTask(target);

			if (newActiveTask) this.renderActiveTask(newActiveTask);
		});
	}

	// отрисовываем общее время всех задач
	renderTimeTotal() {
		const timeTotal = createElement('p', {
			className: 'pomodoro-tasks__deadline-timer',
			textContent: '0 час 00 мин',
		});

		const [hours, minutes] = this.controller.updateTimeTotal();

		timeTotal.textContent = (hours || minutes) ?
			`${hours} ${declOfNum(hours, ['час', 'часа', 'часов'])} ${minutes} минут` :
			'0 час 00 мин';

		this.pomodoroTasks.append(timeTotal);
	}

	// создаем модальное окно
	renderModal() {
		this.modalOverlay = createElement('div', {
			className: 'modal-overlay',
		});
		const modalDelete = createElement('div', {
			className: 'modal-delete',
		});
		const modalTitle = createElement('p', {
			className: 'modal-delete__title',
			textContent: 'Удалить задачу?',
		});
		const modalCloseBtn = createElement('button', {
			className: 'modal-delete__close-button',
			type: 'button',
			ariaLabel: 'Закрыть модальное окно',
		});
		const modalDeleteBtn = createElement('button', {
			className: 'modal-delete__delete-button button-primary',
			type: 'button',
			textContent: 'Удалить',
		});
		const modalCancelBtn = createElement('button', {
			className: 'modal-delete__cancel-button',
			type: 'button',
			textContent: 'Отмена',
		});

		this.modalOverlay.addEventListener('click', ({target}) => {
			const option = this.controller.handleDeleteTask(target);
			if (option === 'running task deleted') this.renderActiveTask({});

			this.modalOverlay.removeAttribute('data-id');
			this.modalOverlay.style.display = 'none';
		});

		modalDelete.append(
				modalTitle,
				modalCloseBtn,
				modalDeleteBtn,
				modalCancelBtn,
		);
		this.modalOverlay.append(modalDelete);
		document.body.append(this.modalOverlay);
	}

	// отрисовываем хедер
	renderHeader() {
		const header = document.createElement('header');
		header.innerHTML = `
				<section class="header">
					<div class="container header__container">
						<img src="./assets/noto_tomato.svg" class="header__logo" alt="Tomato image">
						<h1 class="header__title">Tomato timer</h1>
					</div>
				</section>
			`;
		document.body.prepend(header);
	}

	// отрисовываем текст инструкции
	addHTML() {
		this.pomodoroTasks.insertAdjacentHTML('afterbegin', `
				<p class="pomodoro-tasks__header-title">
					Инструкция:
				</p>
				<ul class="pomodoro-tasks__quest-list">
					<li class="pomodoro-tasks__list-item">
						Напишите название задачи, чтобы её добавить
					</li>
					<li class="pomodoro-tasks__list-item">
						Чтобы задачу активировать, выберите её из списка
					</li>
					<li class="pomodoro-tasks__list-item">
						Запустите таймер
					</li>
					<li class="pomodoro-tasks__list-item">
						Работайте, пока таймер не прозвонит
					</li>
					<li class="pomodoro-tasks__list-item">
						Сделайте короткий перерыв (5 минут)
					</li>
					<li class="pomodoro-tasks__list-item">
						Продолжайте работать, пока задача не будет выполнена.
					</li>
					<li class="pomodoro-tasks__list-item">
						Каждые 4 периода таймера делайте длинный перерыв (15-20 минут).
					</li>
				</ul>
		`);
	}
}

