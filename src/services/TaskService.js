import { getApperClient } from './ApperService';

/**
 * TaskService - Handles all task-related operations
 */
class TaskService {
    constructor() {
        this.tableName = 'task';
        this.client = getApperClient();


    }  /**
   * Fetch all tasks for the current user
   * @returns {Promise} Promise resolving to tasks array
   */
    async fetchTasks() {
        try {
            const params = {
                pagingInfo: { limit: 100, offset: 0 },
                orderBy: [{ field: "createdAt", direction: "desc" }]
            };

            const response = await this.client.fetchRecords(this.tableName, params);
            console.log(response)
            return response.data.map(this.mapTaskFromResponse);
        } catch (error) {
            console.error("Error fetching tasks:", error);
            throw error;

        }

    }  /**
   * Create a new task
   * @param {Object} task - Task object to create
   * @returns {Promise} Promise resolving to created task
   */
    async createTask(task) {
        try {
            const newTask = {
                title: task.title,
                description: task.description || "",
                dueDate: task.dueDate || null,
                priority: task.priority || "medium",
                isCompleted: task.isCompleted || false,
                createdAt: new Date().toISOString()
            };

            const params = { record: newTask };
            const response = await this.client.createRecord(this.tableName, params);
            return this.mapTaskFromResponse(response.data);
        } catch (error) {
            console.error("Error creating task:", error);
            throw error;

        }

    }  /**
   * Update an existing task
   * @param {string} taskId - ID of the task to update
   * @param {Object} task - Task data to update
   * @returns {Promise} Promise resolving to updated task
   */
    async updateTask(taskId, task) {
        try {
            const updateData = {
                title: task.title,
                description: task.description,
                dueDate: task.dueDate,
                priority: task.priority,
                isCompleted: task.isCompleted
            };

            const params = { record: updateData };
            const response = await this.client.updateRecord(this.tableName, taskId, params);
            return this.mapTaskFromResponse(response.data);
        } catch (error) {
            console.error("Error updating task:", error);
            throw error;

        }

    }  /**
   * Toggle a task's completion status
   * @param {string} taskId - ID of the task to toggle
   * @param {boolean} currentStatus - Current completion status
   * @returns {Promise} Promise resolving to updated task
   */
    async toggleTaskCompletion(taskId, currentStatus) {
        try {
            const params = {
                record: {
                    isCompleted: !currentStatus
                }
            };

            const response = await this.client.updateRecord(this.tableName, taskId, params);
            return this.mapTaskFromResponse(response.data);
        } catch (error) {
            console.error("Error toggling task completion:", error);
            throw error;

        }

    }  /**
   * Delete a task
   * @param {string} taskId - ID of the task to delete
   * @returns {Promise} Promise resolving on successful deletion
   */
    async deleteTask(taskId) {
        try {
            await this.client.deleteRecord(this.tableName, taskId);
            return true;
        } catch (error) {
            console.error("Error deleting task:", error);
            throw error;

        }

    }  /**
   * Map a task from database response to application format
   * @param {Object} response - Response from API
   * @returns {Object} Formatted task object
   */
    mapTaskFromResponse(response) {
        return {
            id: response.Id || response.id,
            title: response.title,
            description: response.description,
            dueDate: response.dueDate,
            priority: response.priority,
            isCompleted: response.isCompleted,
            createdAt: response.createdAt || response.CreatedOn
        };



    }
} export default new TaskService();