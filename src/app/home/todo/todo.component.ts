import { Component, OnInit } from '@angular/core';
import { TodoService, TaskModel } from './todo.service';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss']
})
export class TodoComponent implements OnInit {

  tasksList: TaskModel[] = [];

  constructor(private todoService: TodoService) { }

  ngOnInit(): void {
    if (localStorage.getItem('token')) {
      this.todoService.fetchTasks()
      this.todoService.tasksSubject.subscribe((tasks) => {
        this.tasksList = tasks.filter((task) => task.deleted === false)
      });
    }
  }

  noOngoingTasks(): boolean {
    return this.tasksList.filter(todo => !todo.completed).length === 0;
  }
  noCompletedTasks(): boolean {
    return this.tasksList.filter(todo => todo.completed).length === 0;
  }


  completeTask(id: string) {
    const task = {
      completed: true
    }
    this.todoService.updateTask(id, task)
  }
  notCompleteTask(id: string) {
    const task = {
      completed: false
    }
    this.todoService.updateTask(id, task)
  }
  editTask(id: string) {
    this.todoService.onEditTask.next(id)
  }
  deleteTask(id: string) {
    const task = {
      deleted: true
    }
    this.todoService.updateTask(id, task);
  }
}
