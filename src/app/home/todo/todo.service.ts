import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Subject } from "rxjs";
import { AuthService } from "../../auth/auth.service";
import { PopUpService } from "../../pop-up/pop-up.service";

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
    fetchTasksStatus = new BehaviorSubject<boolean>(false);

    onEditTask = new Subject<any>();

    private apiBaseUrl = 'https://task-manager-api-rho-seven.vercel.app';
    // private apiBaseUrl = 'https://localhost:3000';

    constructor(private http: HttpClient, private authService: AuthService, private popUpService: PopUpService) { }

    fetchTasks() {
        this.fetchTasksStatus.next(true);
        const token = this.authService.getToken();
        if (!token) {
            console.error('No token found');
            return;
        }

        this.http.get<TaskModel[]>(`${this.apiBaseUrl}/tasks`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).subscribe(
            (tasks) => {
                this.tasksSubject.next(tasks);
                this.fetchTasksStatus.next(false)
            },
            (error) => {
                this.fetchTasksStatus.next(false)
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

        this.http.post(`${this.apiBaseUrl}/tasks`, task, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).subscribe(
            () => {
                console.log('Task saved successfully');
                this.fetchTasks();
                this.popUpService.successMsg.next('Task Added!')
            },
            (error) => {
                console.error('Error saving task:', error);
                this.popUpService.errorMsg.next('Error saving task!')
            }
        );
    }

    getTask(id: string) {
        const token = this.authService.getToken();

        if (!token) {
            console.error('No token found');
            return;
        }

        return this.http.get<TaskModel>(`${this.apiBaseUrl}/tasks/${id}`, {
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
        this.http.patch(`${this.apiBaseUrl}/tasks/${id}`, task, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).subscribe(() => {
            this.fetchTasks();
            this.popUpService.successMsg.next('Task Updated!')
        }, (error) => {
            console.error('Error updating task:', error);
            this.popUpService.errorMsg.next('Error updating task!')
        })
    }

    deleteTask(id: string): void {
        const token = this.authService.getToken();

        if (!token) {
            console.error('No token found');
            return;
        }

        this.http.delete(`${this.apiBaseUrl}/tasks/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).subscribe(
            () => {
                console.log('Task deleted successfully');
                const updatedTasks = this.tasksSubject.value.filter(t => t._id !== id);
                this.tasksSubject.next(updatedTasks);
                this.fetchTasks();
                this.popUpService.successMsg.next('Task Deleted!')
            },
            (error) => {
                console.error('Error deleting task:', error);
                this.popUpService.errorMsg.next('Error deleting task!')
            },
            () => {
                // Cleanup: Unsubscribe from the observable
                // No need to handle completed logic here as delete operation is a one-time action
            }
        );
    }
}
