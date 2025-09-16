import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Textarea from '@/components/atoms/Textarea';
import Select from '@/components/atoms/Select';
import ApperIcon from '@/components/ApperIcon';
import { subtaskService } from '@/services/api/subtaskService';
import { taskService } from '@/services/api/taskService';
import { projectService } from '@/services/api/projectService';

const SubTaskModal = ({ isOpen, onClose, subtask = null }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'Not Started',
    taskId: '',
    projectId: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loadingLookups, setLoadingLookups] = useState(true);

  useEffect(() => {
    if (isOpen) {
      loadLookupData();
    }
  }, [isOpen]);

  useEffect(() => {
    if (subtask) {
      setFormData({
        name: subtask.name || '',
        description: subtask.description || '',
        status: subtask.status || 'Not Started',
        taskId: subtask.taskId?.toString() || '',
        projectId: subtask.projectId?.toString() || ''
      });
    } else {
      setFormData({
        name: '',
        description: '',
        status: 'Not Started',
        taskId: '',
        projectId: ''
      });
    }
    setErrors({});
  }, [subtask, isOpen]);

  const loadLookupData = async () => {
    try {
      setLoadingLookups(true);
      const [tasksData, projectsData] = await Promise.all([
        taskService.getAll(),
        projectService.getAll()
      ]);
      setTasks(tasksData || []);
      setProjects(projectsData || []);
    } catch (error) {
      console.error('Error loading lookup data:', error);
      toast.error('Failed to load tasks and projects');
    } finally {
      setLoadingLookups(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (formData.name.length > 100) {
      newErrors.name = 'Name must be less than 100 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      const subtaskData = {
        name: formData.name,
        description: formData.description,
        status: formData.status,
        taskId: formData.taskId || null,
        projectId: formData.projectId || null
      };

      if (subtask) {
        await subtaskService.update(subtask.Id, subtaskData);
        toast.success('Subtask updated successfully!');
      } else {
        await subtaskService.create(subtaskData);
        toast.success('Subtask created successfully!');
      }
      
      onClose();
    } catch (error) {
      toast.error('Failed to save subtask. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50"
          onClick={onClose}
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-md bg-white rounded-xl shadow-xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              {subtask ? 'Edit Subtask' : 'Create New Subtask'}
            </h2>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ApperIcon name="X" size={20} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <Input
              label="Subtask Name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              error={errors.name}
              placeholder="Enter subtask name..."
              required
            />

            <Textarea
              label="Description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Add subtask description..."
              rows={3}
            />

            <Select
              label="Status"
              value={formData.status}
              onChange={(e) => handleChange('status', e.target.value)}
            >
              <option value="Not Started">Not Started</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Blocked">Blocked</option>
            </Select>

            {loadingLookups ? (
              <div className="text-center py-4">
                <ApperIcon name="Loader2" size={20} className="animate-spin mx-auto" />
                <p className="text-sm text-gray-500 mt-2">Loading tasks and projects...</p>
              </div>
            ) : (
              <>
                <Select
                  label="Task"
                  value={formData.taskId}
                  onChange={(e) => handleChange('taskId', e.target.value)}
                >
                  <option value="">Select a task (optional)</option>
{tasks.map(task => (
                    <option key={task.Id} value={task.Id}>
                      {task.Name}
                    </option>
                  ))}
                </Select>

                <Select
                  label="Project"
                  value={formData.projectId}
                  onChange={(e) => handleChange('projectId', e.target.value)}
                >
                  <option value="">Select a project (optional)</option>
{projects.map(project => (
                    <option key={project.Id} value={project.Id}>
                      {project.Name}
                    </option>
                  ))}
                </Select>
              </>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={isSubmitting || loadingLookups}
                className="flex-1"
              >
                {isSubmitting ? (
                  <>
                    <ApperIcon name="Loader2" size={16} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <ApperIcon name="Save" size={16} />
                    {subtask ? 'Update' : 'Create'}
                  </>
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default SubTaskModal;