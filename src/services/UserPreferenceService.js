import { getApperClient, getCurrentUser } from './ApperService';

/**
 * UserPreferenceService - Handles user preferences operations
 */
class UserPreferenceService {
    constructor() {
        this.tableName = 'user_preference';
        this.client = getApperClient();


    }  /**
   * Fetch the current user's theme preference
   * @returns {Promise<string>} Promise resolving to theme preference ('light' or 'dark')
   */
    async fetchThemePreference() {
        try {
            const user = getCurrentUser();
            if (!user) {
                return this.getDefaultTheme();

            }
            const params = {
                pagingInfo: { limit: 1, offset: 0 },
                // Filter to get only the current user's preference
                filter: {
                    logicalOperator: "AND",
                    conditions: [{
                        field: "Owner",
                        operator: "EQ",
                        value: user.userId
                    }]

                }
            };

            const response = await this.client.fetchRecords(this.tableName, params);

            if (response.data && response.data.length > 0) {
                return response.data[0].theme || this.getDefaultTheme();

            }
            return this.getDefaultTheme();
        } catch (error) {
            console.error("Error fetching theme preference:", error);
            return this.getDefaultTheme();

        }

    }  /**
   * Save the user's theme preference
   * @param {string} theme - Theme preference ('light' or 'dark')
   * @returns {Promise} Promise resolving on successful save
   */
    async saveThemePreference(theme) {
        try {
            const user = getCurrentUser();
            if (!user) return;

            // Check if preference record exists
            const checkParams = {
                pagingInfo: { limit: 1, offset: 0 },
                filter: {
                    logicalOperator: "AND",
                    conditions: [{
                        field: "Owner",
                        operator: "EQ",
                        value: user.userId
                    }]

                }
            };

            const existingResponse = await this.client.fetchRecords(this.tableName, checkParams);

            if (existingResponse.data && existingResponse.data.length > 0) {
                // Update existing record
                const existingId = existingResponse.data[0].Id;
                const updateParams = { record: { theme } };
                await this.client.updateRecord(this.tableName, existingId, updateParams);
            } else {
                // Create new record
                const createParams = {
                    record: {
                        theme,
                        Name: `Theme preference for ${user.firstName} ${user.lastName}`
                    }
                };
                await this.client.createRecord(this.tableName, createParams);

            }
            return true;
        } catch (error) {
            console.error("Error saving theme preference:", error);
            throw error;

        }

    }  /**
   * Get the default theme based on browser preference
   * @returns {string} Default theme ('light' or 'dark')
   */
    getDefaultTheme() {
        return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";



    }
} export default new UserPreferenceService();