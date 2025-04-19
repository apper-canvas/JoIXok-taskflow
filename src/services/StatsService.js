import { getApperClient } from './ApperService';

/**
 * StatsService - Handles task statistics operations
 */
class StatsService {
    constructor() {
        this.tableName = 'task_stats';
        this.client = getApperClient();


    }  /**
   * Fetch task statistics
   * @returns {Promise} Promise resolving to task statistics
   */
    async fetchStats() {
        try {
            // First try to get existing stats record
            const params = {
                pagingInfo: {
                    limit: 1, offset: 0
                }
            };

            const response = await this.client.fetchRecords(this.tableName, params);

            if (response.data && response.data.length > 0) {
                return this.mapStatsFromResponse(response.data[0]);

            }
            // If no stats record exists, return default stats
            return {
                total: 0,
                completed: 0,
                pending: 0,
                highPriority: 0
            };
        } catch (error) {
            console.error("Error fetching stats:", error);
            throw error;

        }

    }  /**
   * Update task statistics
   * @param {Object} stats - Statistics object to save
   * @returns {Promise} Promise resolving to updated statistics
   */
    async updateStats(stats) {
        try {
            // Check if we have an existing stats record
            const existingParams = {
                pagingInfo: {
                    limit: 1, offset: 0
                }
            };

            const existingResponse = await this.client.fetchRecords(this.tableName, existingParams);

            if (existingResponse.data && existingResponse.data.length > 0) {
                // Update existing record
                const existingId = existingResponse.data[0].Id;
                const params = {
                    record: {
                        total: stats.total,
                        completed: stats.completed,
                        pending: stats.pending,
                        highPriority: stats.highPriority
                    }
                };

                const response = await this.client.updateRecord(this.tableName, existingId, params);
                return this.mapStatsFromResponse(response.data);
            } else {
                // Create new stats record
                const params = {
                    record: {
                        total: stats.total,
                        completed: stats.completed,
                        pending: stats.pending,
                        highPriority: stats.highPriority
                    }
                };

                const response = await this.client.createRecord(this.tableName, params);
                return this.mapStatsFromResponse(response.data);

            }
        } catch (error) {
            console.error("Error updating stats:", error);
            throw error;

        }

    }  /**
   * Calculate statistics from tasks
   * @param {Array} tasks - Array of task objects
   * @returns {Object} Calculated statistics
   */
    calculateStats(tasks) {
        const completed = tasks.filter(task => task.isCompleted).length;
        const highPriority = tasks.filter(task => task.priority === "high").length;

        return {
            total: tasks.length,
            completed,
            pending: tasks.length - completed,
            highPriority
        };


    }  /**
   * Map stats from database response to application format
   * @param {Object} response - Response from API
   * @returns {Object} Formatted stats object
   */
    mapStatsFromResponse(response) {
        return {
            id: response.Id,
            total: response.total || 0,
            completed: response.completed || 0,
            pending: response.pending || 0,
            highPriority: response.highPriority || 0
        };



    }
} export default new StatsService();