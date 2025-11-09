// Text and String Constants
export const APP_STRINGS = {
    APP_NAME: 'Travel Mate Admin',
    APP_DESCRIPTION: 'Your Travel Companion To Guid You',
    COPYRIGHT: '© 2025 Travel Mate. All rights reserved.',
    VERSION: '1.0.0'
} as const;

export const NAVIGATION_STRINGS = {
    HOME: 'Home',
    DESTINATIONS: 'Destinations',
    REGION: 'Region',
    COUNTRIES: 'Country',
    TRIPS: 'Trips',
    ITINERARIES: 'Itineraries',
    TRAVEL_JOURNALS: 'Travel Journals',
    SETTINGS: 'Settings',
    PROFILE: 'Profile'
} as const;

export const BUTTON_STRINGS = {
    // Actions
    ADD: 'Add',
    EDIT: 'Edit',
    DELETE: 'Delete',
    SAVE: 'Save',
    CANCEL: 'Cancel',
    SUBMIT: 'Submit',
    RESET: 'Reset',
    CLEAR: 'Clear',
    SEARCH: 'Search',
    FILTER: 'Filter',
    EXPORT: 'Export',
    IMPORT: 'Import',
    UPLOAD: 'Upload',
    DOWNLOAD: 'Download',

    // Status Actions
    APPROVE: 'Approve',
    REJECT: 'Reject',
    ACTIVATE: 'Activate',
    DEACTIVATE: 'Deactivate',
    ENABLE: 'Enable',
    DISABLE: 'Disable',
    PUBLISH: 'Publish',
    UNPUBLISH: 'Unpublish',

    // Navigation
    BACK: 'Back',
    NEXT: 'Next',
    PREVIOUS: 'Previous',
    CONTINUE: 'Continue',
    FINISH: 'Finish',

    // Authentication
    LOGIN: 'Login',
    LOGOUT: 'Logout',
    SIGN_IN: 'Sign In',
    SIGN_OUT: 'Sign Out',
    FORGOT_PASSWORD: 'Forgot Password',
    RESET_PASSWORD: 'Reset Password',
    CHANGE_PASSWORD: 'Change Password'
} as const;

export const MESSAGE_STRINGS = {
    // Success Messages
    SUCCESS: {
        CREATED: 'Created successfully',
        UPDATED: 'Updated successfully',
        DELETED: 'Deleted successfully',
        SAVED: 'Saved successfully',
        UPLOADED: 'Uploaded successfully',
        APPROVED: 'Approved successfully',
        REJECTED: 'Rejected successfully',
        ACTIVATED: 'Activated successfully',
        DEACTIVATED: 'Deactivated successfully',
        LOGIN: 'Login successful',
        LOGOUT: 'Logout successful',
        PASSWORD_CHANGED: 'Password changed successfully'
    },

    // Error Messages
    ERROR: {
        GENERIC: 'Something went wrong. Please try again.',
        NETWORK: 'Network error. Please check your connection.',
        SERVER: 'Server error. Please try again later.',
        VALIDATION: 'Please check your input and try again.',
        UNAUTHORIZED: 'You are not authorized to perform this action.',
        FORBIDDEN: 'Access denied.',
        NOT_FOUND: 'Resource not found.',
        CONFLICT: 'Resource already exists.',
        INVALID_CREDENTIALS: 'Invalid email or password.',
        EXPIRED_TOKEN: 'Session expired. Please login again.',
        FILE_TOO_LARGE: 'File size is too large.',
        INVALID_FILE_TYPE: 'Invalid file type.',
        REQUIRED_FIELD: 'This field is required.',
        INVALID_EMAIL: 'Please enter a valid email address.',
        WEAK_PASSWORD: 'Password is too weak.',
        PASSWORD_MISMATCH: 'Passwords do not match.'
    },

    // Warning Messages
    WARNING: {
        UNSAVED_CHANGES: 'You have unsaved changes. Are you sure you want to leave?',
        DELETE_CONFIRMATION: 'Are you sure you want to delete this item?',
        BULK_DELETE_CONFIRMATION: 'Are you sure you want to delete selected items?',
        IRREVERSIBLE_ACTION: 'This action cannot be undone.',
        LOGOUT_CONFIRMATION: 'Are you sure you want to logout?'
    },

    // Info Messages
    INFO: {
        LOADING: 'Loading...',
        NO_DATA: 'No data available',
        EMPTY_LIST: 'No items found',
        SEARCH_NO_RESULTS: 'No results found for your search',
        UPLOADING: 'Uploading...',
        PROCESSING: 'Processing...',
        PLEASE_WAIT: 'Please wait...'
    }
} as const;

export const FORM_LABELS = {
    // User Fields
    FIRST_NAME: 'First Name',
    LAST_NAME: 'Last Name',
    EMAIL: 'Email Address',
    PASSWORD: 'Password',
    CONFIRM_PASSWORD: 'Confirm Password',
    PHONE: 'Phone Number',
    DATE_OF_BIRTH: 'Date of Birth',
    GENDER: 'Gender',

    // Address Fields
    ADDRESS: 'Address',
    CITY: 'City',
    STATE: 'State',
    COUNTRY: 'Country',
    POSTAL_CODE: 'Postal Code',

    // Content Fields
    TITLE: 'Title',
    DESCRIPTION: 'Description',
    CONTENT: 'Content',
    CATEGORY: 'Category',
    TAGS: 'Tags',
    STATUS: 'Status',

    // Date Fields
    START_DATE: 'Start Date',
    END_DATE: 'End Date',
    CREATED_DATE: 'Created Date',
    UPDATED_DATE: 'Updated Date',

    // Other Fields
    NAME: 'Name',
    TYPE: 'Type',
    ROLE: 'Role',
    PERMISSIONS: 'Permissions',
    IMAGE: 'Image',
    FILE: 'File',
    URL: 'URL',
    NOTES: 'Notes'
} as const;

export const PLACEHOLDER_STRINGS = {
    SEARCH: 'Search...',
    EMAIL: 'Enter your email',
    PASSWORD: 'Enter your password',
    NAME: 'Enter name',
    DESCRIPTION: 'Enter description',
    SELECT_OPTION: 'Select an option',
    CHOOSE_FILE: 'Choose a file',
    TYPE_TO_SEARCH: 'Type to search...',
    NO_OPTIONS: 'No options available'
} as const;

export const STATUS_STRINGS = {
    ACTIVE: 'Active',
    INACTIVE: 'Inactive',
    PENDING: 'Pending',
    APPROVED: 'Approved',
    REJECTED: 'Rejected',
    DRAFT: 'Draft',
    PUBLISHED: 'Published',
    ARCHIVED: 'Archived',
    DELETED: 'Deleted',
    ENABLED: 'Enabled',
    DISABLED: 'Disabled'
} as const;

export type AppString = keyof typeof APP_STRINGS;
export type NavigationString = keyof typeof NAVIGATION_STRINGS;
export type ButtonString = keyof typeof BUTTON_STRINGS;
export type StatusString = keyof typeof STATUS_STRINGS;
