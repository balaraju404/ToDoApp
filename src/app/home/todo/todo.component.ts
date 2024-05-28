import { Component, OnInit } from '@angular/core';
import { TodoService, TaskModel } from './todo.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss']
})
export class TodoComponent implements OnInit {

  tasksList: TaskModel[] = [];
  onGoingTasksList: TaskModel[] = [];
  completedTasksList: TaskModel[] = [];
  fetchTasksStatus: boolean;
  tasksSubscription: Subscription;

  constructor(private todoService: TodoService) { }

  ngOnInit(): void {
    if (localStorage.getItem('token')) {
      this.fetchTasks();
      this.subscribeToTasks();
    }
  }

  ngOnDestroy(): void {
    if (this.tasksSubscription) {
      this.tasksSubscription.unsubscribe();
    }
  }

  fetchTasks(): void {
    this.todoService.fetchTasks();
  }

  subscribeToTasks(): void {
    this.tasksSubscription = this.todoService.tasksSubject.subscribe((tasks) => {
      this.tasksList = tasks.filter((task) => !task.deleted);
      this.onGoingTasksList = tasks.filter((task) => !task.deleted && !task.completed);
      this.completedTasksList = tasks.filter((task) => !task.deleted && task.completed);
    });

    this.todoService.fetchTasksStatus.subscribe((status) => {
      this.fetchTasksStatus = status;
    });
  }

  drop(event: CdkDragDrop<TaskModel[]>): void {
    console.log(event);
    const task = event.previousContainer.data[event.previousIndex]

    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      console.log(task);

      this.updateTask(task._id, { completed: !task.completed });
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }

  noOngoingTasks(): boolean {
    return this.onGoingTasksList.length === 0;
  }

  noCompletedTasks(): boolean {
    return this.completedTasksList.length === 0;
  }

  completeTask(id: string): void {
    this.updateTask(id, { completed: true });
  }

  notCompleteTask(id: string): void {
    this.updateTask(id, { completed: false });
  }

  editTask(id: string): void {
    this.todoService.onEditTask.next(id);
  }

  deleteTask(id: string): void {
    this.updateTask(id, { deleted: true });
  }

  updateTask(id: string, changes: Partial<TaskModel>): void {
    this.todoService.updateTask(id, changes);
  }
}
