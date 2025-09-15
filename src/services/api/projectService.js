export const projectService = {
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
          { field: { Name: "projectName_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "startDate_c" } },
          { field: { Name: "endDate_c" } },
          { field: { Name: "Owner" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "CreatedBy" } },
          { field: { Name: "ModifiedBy" } }
        ],
        orderBy: [
          { fieldName: "CreatedOn", sorttype: "DESC" }
        ]
      };

      const response = await apperClient.fetchRecords('project_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      // Map database fields to UI format
      return response.data.map(project => ({
        Id: project.Id,
        name: project.Name || project.projectName_c || '',
        projectName: project.projectName_c || project.Name || '',
        description: project.description_c || '',
        startDate: project.startDate_c || null,
        endDate: project.endDate_c || null,
        assignee: project.Owner || null, // Owner field as assignee
        createdOn: project.CreatedOn,
        createdBy: project.CreatedBy,
        modifiedBy: project.ModifiedBy
      }));
    } catch (error) {
      console.error('Error fetching projects:', error);
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
          { field: { Name: "projectName_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "startDate_c" } },
          { field: { Name: "endDate_c" } },
          { field: { Name: "Owner" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "CreatedBy" } },
          { field: { Name: "ModifiedBy" } }
        ]
      };

      const response = await apperClient.getRecordById('project_c', id, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      const project = response.data;
      return {
        Id: project.Id,
        name: project.Name || project.projectName_c || '',
        projectName: project.projectName_c || project.Name || '',
        description: project.description_c || '',
        startDate: project.startDate_c || null,
        endDate: project.endDate_c || null,
        assignee: project.Owner || null, // Owner field as assignee
        createdOn: project.CreatedOn,
        createdBy: project.CreatedBy,
        modifiedBy: project.ModifiedBy
      };
    } catch (error) {
      console.error('Error fetching project:', error);
      throw error;
    }
  },

  async create(projectData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields
      const params = {
        records: [{
          Name: projectData.name || projectData.projectName,
          projectName_c: projectData.projectName || projectData.name,
          description_c: projectData.description || '',
          startDate_c: projectData.startDate || null,
          endDate_c: projectData.endDate || null
        }]
      };

      const response = await apperClient.createRecord('project_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || 'Failed to create project');
        }

        const successfulRecord = response.results.find(result => result.success);
        if (successfulRecord) {
          const project = successfulRecord.data;
          return {
            Id: project.Id,
            name: project.Name || project.projectName_c || '',
            projectName: project.projectName_c || project.Name || '',
            description: project.description_c || '',
            startDate: project.startDate_c || null,
            endDate: project.endDate_c || null,
            assignee: project.Owner || null,
            createdOn: project.CreatedOn,
            createdBy: project.CreatedBy,
            modifiedBy: project.ModifiedBy
          };
        }
      }

      throw new Error('No successful record created');
    } catch (error) {
      console.error('Error creating project:', error);
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

      if (updates.name !== undefined || updates.projectName !== undefined) {
        updateData.Name = updates.name || updates.projectName;
        updateData.projectName_c = updates.projectName || updates.name;
      }
      if (updates.description !== undefined) updateData.description_c = updates.description;
      if (updates.startDate !== undefined) updateData.startDate_c = updates.startDate;
      if (updates.endDate !== undefined) updateData.endDate_c = updates.endDate;

      const params = {
        records: [updateData]
      };

      const response = await apperClient.updateRecord('project_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || 'Failed to update project');
        }

        const successfulRecord = response.results.find(result => result.success);
        if (successfulRecord) {
          const project = successfulRecord.data;
          return {
            Id: project.Id,
            name: project.Name || project.projectName_c || '',
            projectName: project.projectName_c || project.Name || '',
            description: project.description_c || '',
            startDate: project.startDate_c || null,
            endDate: project.endDate_c || null,
            assignee: project.Owner || null,
            createdOn: project.CreatedOn,
            createdBy: project.CreatedBy,
            modifiedBy: project.ModifiedBy
          };
        }
      }

      throw new Error('No successful record updated');
    } catch (error) {
      console.error('Error updating project:', error);
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

      const response = await apperClient.deleteRecord('project_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to delete ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || 'Failed to delete project');
        }
      }

      return true;
    } catch (error) {
      console.error('Error deleting project:', error);
      throw error;
    }
  }
};