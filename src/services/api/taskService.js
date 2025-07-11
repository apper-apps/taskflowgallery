export const taskService = {
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
          { field: { Name: "title" } },
          { field: { Name: "description" } },
          { field: { Name: "priority" } },
          { field: { Name: "due_date" } },
          { field: { Name: "completed" } },
          { field: { Name: "completed_at" } },
          { field: { Name: "created_at" } },
          { field: { Name: "order" } },
          { field: { Name: "category_id" } }
        ],
        orderBy: [
          { fieldName: "order", sorttype: "DESC" }
        ]
      };

      const response = await apperClient.fetchRecords('task', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

// Map database fields to UI format
      return response.data.map(task => ({
        Id: task.Id,
        title: task.title || task.Name,
        description: task.description || '',
        categoryId: task.category_id || '',
        priority: task.priority || 'medium',
        dueDate: task.due_date || null,
        completed: !!(task.completed && task.completed.trim()), // Convert string to boolean for UI
        completedAt: task.completed_at || null,
        createdAt: task.created_at || task.CreatedOn,
        order: task.order || 0
      }));
    } catch (error) {
      console.error('Error fetching tasks:', error);
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
          { field: { Name: "title" } },
          { field: { Name: "description" } },
          { field: { Name: "priority" } },
          { field: { Name: "due_date" } },
          { field: { Name: "completed" } },
          { field: { Name: "completed_at" } },
          { field: { Name: "created_at" } },
          { field: { Name: "order" } },
          { field: { Name: "category_id" } }
        ]
      };

      const response = await apperClient.getRecordById('task', id, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      const task = response.data;
return {
        Id: task.Id,
        title: task.title || task.Name,
        description: task.description || '',
        categoryId: task.category_id || '',
        priority: task.priority || 'medium',
        dueDate: task.due_date || null,
        completed: !!(task.completed && task.completed.trim()), // Convert string to boolean for UI
        completedAt: task.completed_at || null,
        createdAt: task.created_at || task.CreatedOn,
        order: task.order || 0
      };
    } catch (error) {
      console.error('Error fetching task:', error);
      throw error;
    }
  },

  async create(taskData) {
try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields
      const params = {
records: [{
          Name: taskData.title,
          title: taskData.title,
          description: taskData.description || '',
          priority: taskData.priority || 'medium',
          due_date: taskData.dueDate || null,
          completed: "", // Checkbox fields require string format - empty string for unchecked
          completed_at: null,
          created_at: new Date().toISOString(),
          order: Date.now(),
          category_id: taskData.categoryId ? parseInt(taskData.categoryId) : null
        }]
      };

      const response = await apperClient.createRecord('task', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || 'Failed to create task');
        }

const successfulRecord = response.results.find(result => result.success);
        if (successfulRecord) {
          const task = successfulRecord.data;
          return {
            Id: task.Id,
            title: task.title || task.Name,
            description: task.description || '',
            categoryId: task.category_id || '',
            priority: task.priority || 'medium',
            dueDate: task.due_date || null,
            completed: !!(task.completed && task.completed.trim()), // Convert string to boolean for UI
            completedAt: task.completed_at || null,
            createdAt: task.created_at || task.CreatedOn,
            order: task.order || 0
          };
        }
      }

      throw new Error('No successful record created');
    } catch (error) {
      console.error('Error creating task:', error);
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

      if (updates.title !== undefined) {
        updateData.Name = updates.title;
        updateData.title = updates.title;
      }
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.priority !== undefined) updateData.priority = updates.priority;
      if (updates.dueDate !== undefined) updateData.due_date = updates.dueDate;
      if (updates.completed !== undefined) {
        // Convert boolean to string format for Checkbox fields
        updateData.completed = updates.completed ? "completed" : "";
      }
      if (updates.completedAt !== undefined) updateData.completed_at = updates.completedAt;
      if (updates.order !== undefined) updateData.order = updates.order;
      if (updates.categoryId !== undefined) updateData.category_id = updates.categoryId ? parseInt(updates.categoryId) : null;
      const params = {
        records: [updateData]
      };

      const response = await apperClient.updateRecord('task', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || 'Failed to update task');
        }

const successfulRecord = response.results.find(result => result.success);
        if (successfulRecord) {
          const task = successfulRecord.data;
          return {
            Id: task.Id,
            title: task.title || task.Name,
            description: task.description || '',
            categoryId: task.category_id || '',
            priority: task.priority || 'medium',
            dueDate: task.due_date || null,
            completed: !!(task.completed && task.completed.trim()), // Convert string to boolean for UI
            completedAt: task.completed_at || null,
            createdAt: task.created_at || task.CreatedOn,
            order: task.order || 0
          };
        }
      }

      throw new Error('No successful record updated');
    } catch (error) {
      console.error('Error updating task:', error);
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

      const response = await apperClient.deleteRecord('task', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to delete ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || 'Failed to delete task');
        }
      }

      return true;
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  }
};