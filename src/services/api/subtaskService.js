export const subtaskService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "name_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "task_c" } },
          { field: { Name: "project_c" } },
          { field: { Name: "CreatedOn" } }
        ],
        orderBy: [
          { fieldName: "CreatedOn", sorttype: "DESC" }
        ]
      };

      const response = await apperClient.fetchRecords('subtask_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      // Map database fields to UI format
      return response.data.map(subtask => ({
        Id: subtask.Id,
        name: subtask.name_c || subtask.Name || '',
        description: subtask.description_c || '',
        status: subtask.status_c || 'Not Started',
        taskId: subtask.task_c?.Id || subtask.task_c || null,
        taskName: subtask.task_c?.Name || '',
        projectId: subtask.project_c?.Id || subtask.project_c || null,
        projectName: subtask.project_c?.Name || '',
        createdAt: subtask.CreatedOn
      }));
    } catch (error) {
      console.error('Error fetching subtasks:', error);
      throw error;
    }
  },

  async getById(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "name_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "task_c" } },
          { field: { Name: "project_c" } },
          { field: { Name: "CreatedOn" } }
        ]
      };

      const response = await apperClient.getRecordById('subtask_c', id, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      const subtask = response.data;
      return {
        Id: subtask.Id,
        name: subtask.name_c || subtask.Name || '',
        description: subtask.description_c || '',
        status: subtask.status_c || 'Not Started',
        taskId: subtask.task_c?.Id || subtask.task_c || null,
        taskName: subtask.task_c?.Name || '',
        projectId: subtask.project_c?.Id || subtask.project_c || null,
        projectName: subtask.project_c?.Name || '',
        createdAt: subtask.CreatedOn
      };
    } catch (error) {
      console.error('Error fetching subtask:', error);
      throw error;
    }
  },

  async create(subtaskData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields
      const params = {
        records: [{
          Name: subtaskData.name,
          name_c: subtaskData.name,
          description_c: subtaskData.description || '',
          status_c: subtaskData.status || 'Not Started',
          task_c: subtaskData.taskId ? parseInt(subtaskData.taskId) : null,
          project_c: subtaskData.projectId ? parseInt(subtaskData.projectId) : null
        }]
      };

      const response = await apperClient.createRecord('subtask_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || 'Failed to create subtask');
        }

        const successfulRecord = response.results.find(result => result.success);
        if (successfulRecord) {
          const subtask = successfulRecord.data;
          return {
            Id: subtask.Id,
            name: subtask.name_c || subtask.Name || '',
            description: subtask.description_c || '',
            status: subtask.status_c || 'Not Started',
            taskId: subtask.task_c?.Id || subtask.task_c || null,
            taskName: subtask.task_c?.Name || '',
            projectId: subtask.project_c?.Id || subtask.project_c || null,
            projectName: subtask.project_c?.Name || '',
            createdAt: subtask.CreatedOn
          };
        }
      }

      throw new Error('No successful record created');
    } catch (error) {
      console.error('Error creating subtask:', error);
      throw error;
    }
  },

  async update(id, updates) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields
      const updateData = {
        Id: id
      };

      if (updates.name !== undefined) {
        updateData.Name = updates.name;
        updateData.name_c = updates.name;
      }
      if (updates.description !== undefined) updateData.description_c = updates.description;
      if (updates.status !== undefined) updateData.status_c = updates.status;
      if (updates.taskId !== undefined) updateData.task_c = updates.taskId ? parseInt(updates.taskId) : null;
      if (updates.projectId !== undefined) updateData.project_c = updates.projectId ? parseInt(updates.projectId) : null;

      const params = {
        records: [updateData]
      };

      const response = await apperClient.updateRecord('subtask_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || 'Failed to update subtask');
        }

        const successfulRecord = response.results.find(result => result.success);
        if (successfulRecord) {
          const subtask = successfulRecord.data;
          return {
            Id: subtask.Id,
            name: subtask.name_c || subtask.Name || '',
            description: subtask.description_c || '',
            status: subtask.status_c || 'Not Started',
            taskId: subtask.task_c?.Id || subtask.task_c || null,
            taskName: subtask.task_c?.Name || '',
            projectId: subtask.project_c?.Id || subtask.project_c || null,
            projectName: subtask.project_c?.Name || '',
            createdAt: subtask.CreatedOn
          };
        }
      }

      throw new Error('No successful record updated');
    } catch (error) {
      console.error('Error updating subtask:', error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        RecordIds: [id]
      };

      const response = await apperClient.deleteRecord('subtask_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to delete ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || 'Failed to delete subtask');
        }
      }

      return true;
    } catch (error) {
      console.error('Error deleting subtask:', error);
      throw error;
    }
  }
};