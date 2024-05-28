import { Component, OnInit } from '@angular/core';
import { TaskModel, TodoService } from '../home/todo/todo.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recycle-bin',
  templateUrl: './recycle-bin.component.html',
  styleUrl: './recycle-bin.component.scss'
})
export class RecycleBinComponent implements OnInit {

  deletedTasks: TaskModel[] = [];
  fetchTasksStatus: boolean;
  constructor(private todoService: TodoService, private router: Router) { }

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/auth'])
      return;
    }
    this.todoService.fetchTasks()
    this.todoService.tasksSubject.subscribe((tasks) => {
      this.deletedTasks = tasks.filter((task) => task.deleted === true)
    })
    this.todoService.fetchTasksStatus.subscribe((status) => {
      this.fetchTasksStatus = status;
    });
  }

  restoreTask(id: string) {
    const task = {
      deleted: false
    }
    this.todoService.updateTask(id, task)
  }
  permanentDeleteTask(id: string) {
    this.todoService.deleteTask(id)
  }
}
