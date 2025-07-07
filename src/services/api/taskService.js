class TaskService {
  constructor() {
    // Initialize ApperClient
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'task';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "description" } },
          { field: { Name: "due_date" } },
          { field: { Name: "priority" } },
          { field: { Name: "status" } },
          { field: { Name: "project_id" } },
          { field: { Name: "created_at" } },
          { field: { Name: "updated_at" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } }
        ],
        orderBy: [
          {
            fieldName: "created_at",
            sorttype: "DESC"
          }
        ]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      // Map database fields to UI expected fields
      return response.data.map(task => ({
        Id: task.Id,
        Name: task.Name,
        title: task.title,
        description: task.description,
        dueDate: task.due_date,
        priority: task.priority,
        status: task.status,
        projectId: task.project_id?.Id || task.project_id,
        createdAt: task.created_at,
        updatedAt: task.updated_at,
        Tags: task.Tags,
        Owner: task.Owner
      }));
    } catch (error) {
      console.error("Error fetching tasks:", error);
      throw error;
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "description" } },
          { field: { Name: "due_date" } },
          { field: { Name: "priority" } },
          { field: { Name: "status" } },
          { field: { Name: "project_id" } },
          { field: { Name: "created_at" } },
          { field: { Name: "updated_at" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } }
        ]
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (!response.data) {
        throw new Error('Task not found');
      }
      
      // Map database fields to UI expected fields
      const task = response.data;
      return {
        Id: task.Id,
        Name: task.Name,
        title: task.title,
        description: task.description,
        dueDate: task.due_date,
        priority: task.priority,
        status: task.status,
        projectId: task.project_id?.Id || task.project_id,
        createdAt: task.created_at,
        updatedAt: task.updated_at,
        Tags: task.Tags,
        Owner: task.Owner
      };
    } catch (error) {
      console.error(`Error fetching task with ID ${id}:`, error);
      throw error;
    }
  }

  async getByProject(projectId) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "description" } },
          { field: { Name: "due_date" } },
          { field: { Name: "priority" } },
          { field: { Name: "status" } },
          { field: { Name: "project_id" } },
          { field: { Name: "created_at" } },
          { field: { Name: "updated_at" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } }
        ],
        where: [
          {
            FieldName: "project_id",
            Operator: "EqualTo",
            Values: [parseInt(projectId)]
          }
        ],
        orderBy: [
          {
            fieldName: "created_at",
            sorttype: "DESC"
          }
        ]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      // Map database fields to UI expected fields
      return response.data.map(task => ({
        Id: task.Id,
        Name: task.Name,
        title: task.title,
        description: task.description,
        dueDate: task.due_date,
        priority: task.priority,
        status: task.status,
        projectId: task.project_id?.Id || task.project_id,
        createdAt: task.created_at,
        updatedAt: task.updated_at,
        Tags: task.Tags,
        Owner: task.Owner
      }));
    } catch (error) {
      console.error("Error fetching tasks by project:", error);
      throw error;
    }
  }

  async create(taskData) {
    try {
      // Only include Updateable fields in create operation
      const params = {
        records: [
          {
            Name: taskData.title, // Using title as Name for database
            title: taskData.title,
            description: taskData.description || "",
            due_date: taskData.dueDate || null,
            priority: taskData.priority,
            status: taskData.status,
            project_id: parseInt(taskData.projectId),
            Tags: taskData.Tags || ""
          }
        ]
      };
      
      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || 'Failed to create task');
        }
        
        if (successfulRecords.length > 0) {
          const task = successfulRecords[0].data;
          return {
            Id: task.Id,
            Name: task.Name,
            title: task.title,
            description: task.description,
            dueDate: task.due_date,
            priority: task.priority,
            status: task.status,
            projectId: task.project_id?.Id || task.project_id,
            createdAt: task.created_at,
            updatedAt: task.updated_at,
            Tags: task.Tags,
            Owner: task.Owner
          };
        }
      }
      
      throw new Error('No task created');
    } catch (error) {
      console.error("Error creating task:", error);
      throw error;
    }
  }

  async update(id, updates) {
    try {
      // Only include Updateable fields in update operation
      const updateData = {
        Id: parseInt(id)
      };
      
      // Only include fields that are being updated
      if (updates.title !== undefined) {
        updateData.Name = updates.title;
        updateData.title = updates.title;
      }
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.dueDate !== undefined) updateData.due_date = updates.dueDate;
      if (updates.priority !== undefined) updateData.priority = updates.priority;
      if (updates.status !== undefined) updateData.status = updates.status;
      if (updates.projectId !== undefined) updateData.project_id = parseInt(updates.projectId);
      if (updates.Tags !== undefined) updateData.Tags = updates.Tags;
      
      const params = {
        records: [updateData]
      };
      
      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          throw new Error(failedUpdates[0].message || 'Failed to update task');
        }
        
        if (successfulUpdates.length > 0) {
          const task = successfulUpdates[0].data;
          return {
            Id: task.Id,
            Name: task.Name,
            title: task.title,
            description: task.description,
            dueDate: task.due_date,
            priority: task.priority,
            status: task.status,
            projectId: task.project_id?.Id || task.project_id,
            createdAt: task.created_at,
            updatedAt: task.updated_at,
            Tags: task.Tags,
            Owner: task.Owner
          };
        }
      }
      
      throw new Error('No task updated');
    } catch (error) {
      console.error("Error updating task:", error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await this.apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          throw new Error(failedDeletions[0].message || 'Failed to delete task');
        }
        
        return successfulDeletions.length > 0;
      }
      
      return false;
    } catch (error) {
      console.error("Error deleting task:", error);
      throw error;
    }
  }
}

export const taskService = new TaskService();