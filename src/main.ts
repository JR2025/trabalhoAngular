import { bootstrapApplication } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface Task {
  id: number;
  description: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
}

@Component({
  selector: 'app-root',
  imports: [FormsModule, CommonModule],
  standalone: true,
  template: `
    <div class="app-container">
      <div class="todo-container">
        <header class="header">
          <h1>✨ Lista de Tarefas</h1>
          <p class="subtitle">Organize seu dia de forma produtiva</p>
        </header>

        <main class="main-content">
          <div class="add-task-container">
            <div class="add-task">
              <input 
                type="text" 
                [(ngModel)]="newTask" 
                placeholder="O que você precisa fazer?"
                (keyup.enter)="addTask()"
                class="task-input"
              >
              <select [(ngModel)]="selectedPriority" class="priority-select">
                <option value="low">Baixa Prioridade</option>
                <option value="medium">Média Prioridade</option>
                <option value="high">Alta Prioridade</option>
              </select>
              <button (click)="addTask()" class="add-button">
                <span>Adicionar</span>
                <span class="plus-icon">+</span>
              </button>
            </div>
          </div>

          <div class="filters">
            <button 
              *ngFor="let filter of filters" 
              (click)="currentFilter = filter"
              [class.active]="currentFilter === filter"
              class="filter-button"
            >
              {{ filter }}
            </button>
          </div>

          <div class="tasks-wrapper">
            <ul class="task-list" *ngIf="filteredTasks.length > 0">
              <li *ngFor="let task of filteredTasks" 
                  [class.completed]="task.completed"
                  [class.priority-high]="task.priority === 'high'"
                  [class.priority-medium]="task.priority === 'medium'"
                  [class.priority-low]="task.priority === 'low'"
                  class="task-item">
                <div class="task-content">
                  <label class="checkbox-container">
                    <input 
                      type="checkbox" 
                      [checked]="task.completed"
                      (change)="toggleTask(task)"
                    >
                    <span class="checkmark"></span>
                  </label>
                  <div class="task-info">
                    <span class="task-text">{{ task.description }}</span>
                    <span class="task-date">{{ task.createdAt | date:'short' }}</span>
                  </div>
                </div>
                <div class="task-actions">
                  <span class="priority-badge" [class]="task.priority">
                    {{ task.priority }}
                  </span>
                  <button class="delete-btn" (click)="deleteTask(task)">
                    <span class="delete-icon">×</span>
                  </button>
                </div>
              </li>
            </ul>
            <div *ngIf="filteredTasks.length === 0" class="empty-state">
              <p>Nenhuma tarefa encontrada</p>
              <small>Adicione uma nova tarefa para começar</small>
            </div>
          </div>

          <div class="task-stats">
            <div class="stat-item">
              <span class="stat-label">Total</span>
              <span class="stat-value">{{ tasks.length }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Concluídas</span>
              <span class="stat-value">{{ completedTasks }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Pendentes</span>
              <span class="stat-value">{{ tasks.length - completedTasks }}</span>
            </div>
          </div>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 2rem;
      display: flex;
      justify-content: center;
      align-items: flex-start;
      font-family: 'Segoe UI', system-ui, sans-serif;
    }

    .todo-container {
      width: 100%;
      max-width: 800px;
      background: rgba(255, 255, 255, 0.95);
      border-radius: 20px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }

    .header {
      text-align: center;
      padding: 2rem;
      background: white;
      border-bottom: 1px solid #eee;
    }

    .header h1 {
      color: #2d3748;
      font-size: 2.5em;
      margin: 0;
      font-weight: 700;
    }

    .subtitle {
      color: #718096;
      margin-top: 0.5rem;
      font-size: 1.1rem;
    }

    .main-content {
      padding: 2rem;
    }

    .add-task-container {
      margin-bottom: 2rem;
    }

    .add-task {
      display: flex;
      gap: 1rem;
    }

    .task-input {
      flex: 1;
      padding: 1rem;
      border: 2px solid #e2e8f0;
      border-radius: 10px;
      font-size: 1rem;
      transition: all 0.3s ease;
    }

    .task-input:focus {
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
      outline: none;
    }

    .priority-select {
      padding: 0.5rem 1rem;
      border: 2px solid #e2e8f0;
      border-radius: 10px;
      background: white;
      color: #4a5568;
      font-size: 0.9rem;
      cursor: pointer;
    }

    .add-button {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0 1.5rem;
      background: #667eea;
      color: white;
      border: none;
      border-radius: 10px;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .add-button:hover {
      background: #5a67d8;
      transform: translateY(-1px);
    }

    .plus-icon {
      font-size: 1.2rem;
      font-weight: bold;
    }

    .filters {
      display: flex;
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .filter-button {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 20px;
      background: #edf2f7;
      color: #4a5568;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .filter-button.active {
      background: #667eea;
      color: white;
    }

    .tasks-wrapper {
      background: white;
      border-radius: 15px;
      overflow: hidden;
    }

    .task-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .task-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem;
      border-bottom: 1px solid #edf2f7;
      transition: all 0.3s ease;
    }

    .task-item:hover {
      background: #f7fafc;
    }

    .task-content {
      display: flex;
      align-items: center;
      gap: 1rem;
      flex: 1;
    }

    .checkbox-container {
      display: block;
      position: relative;
      padding-left: 35px;
      cursor: pointer;
      user-select: none;
    }

    .checkbox-container input {
      position: absolute;
      opacity: 0;
      cursor: pointer;
      height: 0;
      width: 0;
    }

    .checkmark {
      position: absolute;
      top: -10px;
      left: 0;
      height: 20px;
      width: 20px;
      background-color: #edf2f7;
      border-radius: 5px;
      transition: all 0.3s ease;
    }

    .checkbox-container:hover input ~ .checkmark {
      background-color: #e2e8f0;
    }

    .checkbox-container input:checked ~ .checkmark {
      background-color: #667eea;
    }

    .checkmark:after {
      content: "";
      position: absolute;
      display: none;
    }

    .checkbox-container input:checked ~ .checkmark:after {
      display: block;
    }

    .checkbox-container .checkmark:after {
      left: 7px;
      top: 3px;
      width: 5px;
      height: 10px;
      border: solid white;
      border-width: 0 2px 2px 0;
      transform: rotate(45deg);
    }

    .task-info {
      display: flex;
      flex-direction: column;
    }

    .task-text {
      color: #2d3748;
      font-size: 1rem;
    }

    .task-date {
      color: #a0aec0;
      font-size: 0.8rem;
    }

    .task-actions {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .priority-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.8rem;
      text-transform: capitalize;
    }

    .priority-badge.high {
      background: #fed7d7;
      color: #c53030;
    }

    .priority-badge.medium {
      background: #fefcbf;
      color: #b7791f;
    }

    .priority-badge.low {
      background: #c6f6d5;
      color: #2f855a;
    }

    .delete-btn {
      background: none;
      border: none;
      color: #a0aec0;
      cursor: pointer;
      font-size: 1.5rem;
      padding: 0.25rem;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
    }

    .delete-btn:hover {
      color: #e53e3e;
      transform: scale(1.1);
    }

    .task-item.completed .task-text {
      text-decoration: line-through;
      color: #a0aec0;
    }

    .empty-state {
      text-align: center;
      padding: 3rem;
      color: #a0aec0;
    }

    .empty-state p {
      font-size: 1.2rem;
      margin: 0;
    }

    .empty-state small {
      font-size: 0.9rem;
    }

    .task-stats {
      display: flex;
      justify-content: space-around;
      padding: 2rem;
      background: #f7fafc;
      border-radius: 15px;
      margin-top: 2rem;
    }

    .stat-item {
      text-align: center;
    }

    .stat-label {
      display: block;
      color: #718096;
      font-size: 0.9rem;
      margin-bottom: 0.5rem;
    }

    .stat-value {
      color: #2d3748;
      font-size: 1.5rem;
      font-weight: bold;
    }

    @media (max-width: 640px) {
      .app-container {
        padding: 1rem;
      }

      .add-task {
        flex-direction: column;
      }

      .priority-select {
        width: 100%;
      }

      .add-button {
        width: 100%;
        justify-content: center;
      }

      .filters {
        flex-wrap: wrap;
      }

      .filter-button {
        flex: 1;
        text-align: center;
      }
    }
  `]
})
export class App {
  tasks: Task[] = [];
  newTask: string = '';
  selectedPriority: 'low' | 'medium' | 'high' = 'medium';
  filters = ['Todas', 'Ativas', 'Concluídas'];
  currentFilter = 'Todas';

  get filteredTasks(): Task[] {
    switch (this.currentFilter) {
      case 'Ativas':
        return this.tasks.filter(task => !task.completed);
      case 'Concluídas':
        return this.tasks.filter(task => task.completed);
      default:
        return this.tasks;
    }
  }

  addTask() {
    if (this.newTask.trim()) {
      this.tasks.push({
        id: Date.now(),
        description: this.newTask.trim(),
        completed: false,
        priority: this.selectedPriority,
        createdAt: new Date()
      });
      this.newTask = '';
    }
  }

  toggleTask(task: Task) {
    task.completed = !task.completed;
  }

  deleteTask(task: Task) {
    this.tasks = this.tasks.filter(t => t.id !== task.id);
  }

  get completedTasks(): number {
    return this.tasks.filter(task => task.completed).length;
  }
}

bootstrapApplication(App);