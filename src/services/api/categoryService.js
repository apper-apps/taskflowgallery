export const categoryService = {
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
          { field: { Name: "color" } },
          { field: { Name: "icon" } },
          { field: { Name: "order" } },
          { field: { Name: "task_count" } },
          { field: { Name: "completed_count" } }
        ],
        orderBy: [
          { fieldName: "order", sorttype: "ASC" }
        ]
      };

      const response = await apperClient.fetchRecords('category', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      // Map database fields to UI format
      return response.data.map(category => ({
        Id: category.Id,
        name: category.Name,
        color: category.color || '#5B21B6',
        icon: category.icon || null,
        order: category.order || 0,
        taskCount: category.task_count || 0,
        completedCount: category.completed_count || 0
      }));
    } catch (error) {
      console.error('Error fetching categories:', error);
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
          { field: { Name: "color" } },
          { field: { Name: "icon" } },
          { field: { Name: "order" } },
          { field: { Name: "task_count" } },
          { field: { Name: "completed_count" } }
        ]
      };

      const response = await apperClient.getRecordById('category', id, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      const category = response.data;
      return {
        Id: category.Id,
        name: category.Name,
        color: category.color || '#5B21B6',
        icon: category.icon || null,
        order: category.order || 0,
        taskCount: category.task_count || 0,
        completedCount: category.completed_count || 0
      };
    } catch (error) {
      console.error('Error fetching category:', error);
      throw error;
    }
  },

  async create(categoryData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields
      const params = {
        records: [{
          Name: categoryData.name,
          color: categoryData.color || '#5B21B6',
          icon: categoryData.icon || null,
          order: Date.now(),
          task_count: 0,
          completed_count: 0
        }]
      };

      const response = await apperClient.createRecord('category', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || 'Failed to create category');
        }

        const successfulRecord = response.results.find(result => result.success);
        if (successfulRecord) {
          const category = successfulRecord.data;
          return {
            Id: category.Id,
            name: category.Name,
            color: category.color || '#5B21B6',
            icon: category.icon || null,
            order: category.order || 0,
            taskCount: category.task_count || 0,
            completedCount: category.completed_count || 0
          };
        }
      }

      throw new Error('No successful record created');
    } catch (error) {
      console.error('Error creating category:', error);
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

      if (updates.name !== undefined) updateData.Name = updates.name;
      if (updates.color !== undefined) updateData.color = updates.color;
      if (updates.icon !== undefined) updateData.icon = updates.icon;
      if (updates.order !== undefined) updateData.order = updates.order;
      if (updates.taskCount !== undefined) updateData.task_count = updates.taskCount;
      if (updates.completedCount !== undefined) updateData.completed_count = updates.completedCount;

      const params = {
        records: [updateData]
      };

      const response = await apperClient.updateRecord('category', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || 'Failed to update category');
        }

        const successfulRecord = response.results.find(result => result.success);
        if (successfulRecord) {
          const category = successfulRecord.data;
          return {
            Id: category.Id,
            name: category.Name,
            color: category.color || '#5B21B6',
            icon: category.icon || null,
            order: category.order || 0,
            taskCount: category.task_count || 0,
            completedCount: category.completed_count || 0
          };
        }
      }

      throw new Error('No successful record updated');
    } catch (error) {
      console.error('Error updating category:', error);
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

      const response = await apperClient.deleteRecord('category', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to delete ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || 'Failed to delete category');
        }
      }

      return true;
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  }
};