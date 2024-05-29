import { Component, OnInit } from '@angular/core';
import { TodoService } from '../home/todo/todo.service';

@Component({
  selector: 'app-update-todo',
  templateUrl: './update-todo.component.html',
  styleUrl: './update-todo.component.scss'
})
export class UpdateTodoComponent implements OnInit {

  fetchTasksStatus: boolean;
  taskName: string;
  editID: any;


  constructor(private todoService: TodoService) { }

  ngOnInit(): void {
    this.todoService.onEditTask.subscribe(id => {
      this.fetchTasksStatus = true;
      if(!id){
        this.fetchTasksStatus = false;
        this.todoService.editMode.next(false)
        return;
      }
      this.editID = id;
      this.todoService.getTask(this.editID).subscribe((task) => {
        this.taskName = task.description
        this.fetchTasksStatus = false;
      })
    })
  }

  updateTask(form) {
    this.todoService.updateTask(this.editID, form.value);
    form.reset();
    this.editID = null;
  }
  onClose() {
    this.todoService.editMode.next(false)
  }
}
