class ProjectService {
  constructor() {
    // Initialize ApperClient
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'project';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "color" } },
          { field: { Name: "tasks_count" } },
          { field: { Name: "created_at" } },
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
      return response.data.map(project => ({
        Id: project.Id,
        name: project.Name,
        color: project.color,
        tasksCount: project.tasks_count || 0,
        createdAt: project.created_at,
        Tags: project.Tags,
        Owner: project.Owner
      }));
    } catch (error) {
      console.error("Error fetching projects:", error);
      throw error;
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "color" } },
          { field: { Name: "tasks_count" } },
          { field: { Name: "created_at" } },
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
        throw new Error('Project not found');
      }
      
      // Map database fields to UI expected fields
      const project = response.data;
      return {
        Id: project.Id,
        name: project.Name,
        color: project.color,
        tasksCount: project.tasks_count || 0,
        createdAt: project.created_at,
        Tags: project.Tags,
        Owner: project.Owner
      };
    } catch (error) {
      console.error(`Error fetching project with ID ${id}:`, error);
      throw error;
    }
  }

  async create(projectData) {
    try {
      // Only include Updateable fields in create operation
      const params = {
        records: [
          {
            Name: projectData.name,
            color: projectData.color,
            Tags: projectData.Tags || "",
            tasks_count: 0
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
          throw new Error(failedRecords[0].message || 'Failed to create project');
        }
        
        if (successfulRecords.length > 0) {
          const project = successfulRecords[0].data;
          return {
            Id: project.Id,
            name: project.Name,
            color: project.color,
            tasksCount: project.tasks_count || 0,
            createdAt: project.created_at,
            Tags: project.Tags,
            Owner: project.Owner
          };
        }
      }
      
      throw new Error('No project created');
    } catch (error) {
      console.error("Error creating project:", error);
      throw error;
    }
  }

  async update(id, updates) {
    try {
      // Only include Updateable fields in update operation
      const params = {
        records: [
          {
            Id: parseInt(id),
            Name: updates.name,
            color: updates.color,
            Tags: updates.Tags || "",
            tasks_count: updates.tasksCount || 0
          }
        ]
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
          throw new Error(failedUpdates[0].message || 'Failed to update project');
        }
        
        if (successfulUpdates.length > 0) {
          const project = successfulUpdates[0].data;
          return {
            Id: project.Id,
            name: project.Name,
            color: project.color,
            tasksCount: project.tasks_count || 0,
            createdAt: project.created_at,
            Tags: project.Tags,
            Owner: project.Owner
          };
        }
      }
      
      throw new Error('No project updated');
    } catch (error) {
      console.error("Error updating project:", error);
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
          throw new Error(failedDeletions[0].message || 'Failed to delete project');
        }
        
        return successfulDeletions.length > 0;
      }
      
      return false;
    } catch (error) {
      console.error("Error deleting project:", error);
      throw error;
    }
  }
}

export const projectService = new ProjectService();