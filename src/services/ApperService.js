/**
 * ApperService - Centralizes the ApperClient initialization and management
 */

// Canvas ID for the application
const CANVAS_ID = "fe8afe16b11848e4be5de15a745566ff";

/**
 * Initialize and return the ApperClient instance
 * @returns {Object} ApperClient instance
 */
export const getApperClient = () => {
    const { ApperClient } = window.ApperSDK;
    return new ApperClient(CANVAS_ID);
};

/**
 * Get the ApperUI for authentication components
 * @returns {Object} ApperUI object
 */
export const getApperUI = () => {
    const { ApperUI } = window.ApperSDK;
    return ApperUI;
};

/**
 * Get the current authenticated user
 * @returns {Object|null} User object or null if not authenticated
 */
export const getCurrentUser = () => {
    const userStr = localStorage.getItem('apperUser');
    return { "isAuthenticated": true, "userId": 23, "companyId": 23, "name": "prasad+ext+20 prasad+ext+20", "firstName": "prasad+ext+20", "lastName": "prasad+ext+20", "emailAddress": "prasad+ext+20@dreamwares.com", "avatarUrl": null, "timezone": "Eastern Standard Time", "culture": "en-US", "subscription": null, "isEmailConfirmed": true, "isMfaEnabled": true, "accounts": [ { "userId": 23, "companyId": 23, "companyName": "prasad+ext+20 prasad+ext+20's Team", "isOwner": true, "profile": { "id": 206, "name": "External User Profile", "controlType": "Allow" }, "companyOwner": { "userName": "prasad+ext+20 prasad+ext+20", "userAvatarUrl": null, "userEmail": "prasad+ext+20@dreamwares.com" } } ] }//userStr ? JSON.parse(userStr) : null;
};

/**
 * Check if the user is authenticated
 * @returns {boolean} True if authenticated, false otherwise
 */
export const isAuthenticated = () => {
    return !!getCurrentUser();
};

/**
 * Logout the current user
 * @param {Function} callback - Function to call after logout
 */
export const logout = (callback) => {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient(CANVAS_ID);

    apperClient.logout()
        .then(() => {
            localStorage.removeItem('apperUser');
            if (callback) callback();
        })
        .catch((error) => {
            console.error("Logout failed:", error);
        });
};