import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { TodoService } from '../todo/todo.service';

@Component({
  selector: 'app-new-todo',
  templateUrl: './new-todo.component.html',
  styleUrl: './new-todo.component.scss'
})
export class NewTodoComponent implements OnInit {
  taskName: string

  fetchTasksStatus: boolean;

  @ViewChild('form') form: NgForm;

  constructor(private todoService: TodoService) { }

  ngOnInit(): void {
  }

  createTask() {
    this.todoService.saveTask(this.form.value);
    this.form.reset();
  }
}
