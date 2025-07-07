/**
 * Setting Service for managing user settings and preferences
 * Integrates with the "setting" table in the database
 */

import { toast } from 'react-toastify';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const settingService = {
  /**
   * Get all settings for a specific user
   */
  async getAll(userId = null) {
    try {
      await delay(300);
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "setting_name" } },
          { field: { Name: "setting_value" } },
          { field: { Name: "user_id" } },
          { field: { Name: "mode" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "CreatedBy" } },
          { field: { Name: "ModifiedOn" } },
          { field: { Name: "ModifiedBy" } }
        ],
        where: userId ? [
          {
            FieldName: "user_id",
            Operator: "EqualTo",
            Values: [userId]
          }
        ] : [],
        orderBy: [
          {
            fieldName: "CreatedOn",
            sorttype: "DESC"
          }
        ],
        pagingInfo: {
          limit: 100,
          offset: 0
        }
      };

      const response = await apperClient.fetchRecords('setting', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching settings:", error);
      toast.error("Failed to load settings");
      return [];
    }
  },

  /**
   * Get setting by ID
   */
  async getById(id) {
    try {
      await delay(200);
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "setting_name" } },
          { field: { Name: "setting_value" } },
          { field: { Name: "user_id" } },
          { field: { Name: "mode" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "CreatedBy" } },
          { field: { Name: "ModifiedOn" } },
          { field: { Name: "ModifiedBy" } }
        ]
      };

      const response = await apperClient.getRecordById('setting', id, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      return response.data || null;
    } catch (error) {
      console.error(`Error fetching setting with ID ${id}:`, error);
      toast.error("Failed to load setting");
      return null;
    }
  },

  /**
   * Create new setting
   */
  async create(settingData) {
    try {
      await delay(300);
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields
      const filteredData = {
        Name: settingData.Name || '',
        Tags: settingData.Tags || '',
        Owner: settingData.Owner || null,
        setting_name: settingData.setting_name,
        setting_value: settingData.setting_value,
        user_id: settingData.user_id,
        mode: settingData.mode || 'Light'
      };

      const params = {
        records: [filteredData]
      };

      const response = await apperClient.createRecord('setting', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);

        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} settings:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

        if (successfulRecords.length > 0) {
          toast.success("Setting created successfully");
          return successfulRecords[0].data;
        }
      }

      return null;
    } catch (error) {
      console.error("Error creating setting:", error);
      toast.error("Failed to create setting");
      return null;
    }
  },

  /**
   * Update existing setting
   */
  async update(id, settingData) {
    try {
      await delay(300);
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields
      const filteredData = {
        Id: id,
        Name: settingData.Name,
        Tags: settingData.Tags,
        Owner: settingData.Owner,
        setting_name: settingData.setting_name,
        setting_value: settingData.setting_value,
        user_id: settingData.user_id,
        mode: settingData.mode
      };

      const params = {
        records: [filteredData]
      };

      const response = await apperClient.updateRecord('setting', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);

        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} settings:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

        if (successfulUpdates.length > 0) {
          toast.success("Setting updated successfully");
          return successfulUpdates[0].data;
        }
      }

      return null;
    } catch (error) {
      console.error("Error updating setting:", error);
      toast.error("Failed to update setting");
      return null;
    }
  },

  /**
   * Delete setting(s)
   */
  async delete(recordIds) {
    try {
      await delay(300);
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const ids = Array.isArray(recordIds) ? recordIds : [recordIds];
      const params = {
        RecordIds: ids
      };

      const response = await apperClient.deleteRecord('setting', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);

        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} settings:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        if (successfulDeletions.length > 0) {
          toast.success(`${successfulDeletions.length} setting(s) deleted successfully`);
        }

        return successfulDeletions.length === ids.length;
      }

      return false;
    } catch (error) {
      console.error("Error deleting settings:", error);
      toast.error("Failed to delete settings");
      return false;
    }
  },

  /**
   * Get user setting by name
   */
  async getUserSetting(userId, settingName) {
    try {
      const settings = await this.getAll(userId);
      return settings.find(setting => setting.setting_name === settingName) || null;
    } catch (error) {
      console.error("Error getting user setting:", error);
      return null;
    }
  },

  /**
   * Update or create user setting
   */
  async updateUserSetting(userId, settingName, settingValue) {
    try {
      const existingSetting = await this.getUserSetting(userId, settingName);
      
      if (existingSetting) {
        return await this.update(existingSetting.Id, {
          ...existingSetting,
          setting_value: settingValue
        });
      } else {
        return await this.create({
          setting_name: settingName,
          setting_value: settingValue,
          user_id: userId,
          Name: settingName,
          mode: settingName === 'theme' ? settingValue : 'Light'
        });
      }
    } catch (error) {
      console.error("Error updating user setting:", error);
      toast.error("Failed to save setting");
      return null;
    }
  }
};

export default settingService;