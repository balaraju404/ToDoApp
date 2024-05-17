import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Subject } from "rxjs";
import { AuthService } from "../../auth/auth.service";

export interface TaskModel {
    _id?: string;
    description: string;
    completed: boolean;
    deleted: boolean;
    owner?: string;
}

@Injectable({ providedIn: 'root' })
export class TodoService {
    tasksSubject = new BehaviorSubject<TaskModel[]>([]);

    onEditTask = new Subject<any>();

    constructor(private http: HttpClient, private authService: AuthService) { }

    fetchTasks() {
        const token = this.authService.getToken();
        if (!token) {
            console.error('No token found');
            return;
        }

        this.http.get<TaskModel[]>('http://localhost:3000/tasks', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).subscribe(
            (tasks) => {
                this.tasksSubject.next(tasks);
            },
            (error) => {
                if (error.status === 401) {
                    console.error('Unauthorized access: Please log in again.');
                } else if (error.status === 403) {
                    console.error('Forbidden: You do not have permission to access this resource.');
                } else if (error.status >= 500) {
                    console.error('Server error: Please try again later.');
                } else {
                    console.error('Error fetching tasks:', error);
                }
                // You could also notify the user with a toast message or modal dialog here
            }
        );
    }

    saveTask(task: TaskModel) {
        const token = this.authService.getToken();

        if (!token) {
            console.error('No token found');
            return;
        }

        this.http.post('http://localhost:3000/tasks', task, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).subscribe(
            () => {
                console.log('Task saved successfully');
                this.fetchTasks();
            },
            (error) => {
                console.error('Error saving task:', error);
            }
        );
    }

    getTask(id: string) {
        const token = this.authService.getToken();

        if (!token) {
            console.error('No token found');
            return;
        }

        return this.http.get<TaskModel>(`http://localhost:3000/tasks/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
    }

    updateTask(id: string, task) {
        const token = this.authService.getToken();

        if (!token) {
            console.error('No token found');
            return;
        }
        this.http.patch(`http://localhost:3000/tasks/${id}`, task, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).subscribe(() => {
            this.fetchTasks();
        }, (error) => {
            console.error('Error updating task:', error);
        })
    }

    deleteTask(id: string): void {
        const token = this.authService.getToken();

        if (!token) {
            console.error('No token found');
            return;
        }

        this.http.delete(`http://localhost:3000/tasks/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).subscribe(
            () => {
                console.log('Task deleted successfully');
                const updatedTasks = this.tasksSubject.value.filter(t => t._id !== id);
                this.tasksSubject.next(updatedTasks);
                this.fetchTasks();
            },
            (error) => {
                console.error('Error deleting task:', error);
            },
            () => {
                // Cleanup: Unsubscribe from the observable
                // No need to handle completed logic here as delete operation is a one-time action
            }
        );
    }
}
