import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { TodoService } from '../todo/todo.service';

@Component({
  selector: 'app-new-todo',
  templateUrl: './new-todo.component.html',
  styleUrl: './new-todo.component.scss'
})
export class NewTodoComponent implements OnInit {
  updateMode: boolean;
  editID: string;
  taskName: string

  fetchTasksStatus: boolean;

  @ViewChild('form') form: NgForm;

  constructor(private todoService: TodoService) { }

  ngOnInit(): void {
    this.todoService.onEditTask.subscribe(id => {
      this.fetchTasksStatus = true;
      console.log(id);
      this.editID = id;
      this.updateMode = true;
      this.todoService.getTask(this.editID).subscribe((task) => {
        this.taskName = task.description
        this.fetchTasksStatus = false;
      })
    })
  }

  createTask() {
    this.todoService.saveTask(this.form.value);
    this.form.reset();
    this.updateMode = false;
  }
  updateTask() {
    this.todoService.updateTask(this.editID, this.form.value);
    this.form.reset();
    this.updateMode = false;
    this.editID = null;
  }
}
