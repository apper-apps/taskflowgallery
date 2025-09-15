import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';
import Loading from '@/components/ui/Loading';
import Empty from '@/components/ui/Empty';
import Error from '@/components/ui/Error';
import { subtaskService } from '@/services/api/subtaskService';
import SubTaskModal from '@/components/organisms/SubTaskModal';

const SubTasksView = () => {
  const [subtasks, setSubtasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSubtask, setSelectedSubtask] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadSubtasks();
  }, []);

  const loadSubtasks = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await subtaskService.getAll();
      setSubtasks(data || []);
    } catch (err) {
      setError('Failed to load subtasks. Please try again.');
      console.error('Error loading subtasks:', err);
      setSubtasks([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredSubtasks = useMemo(() => {
    let filtered = [...subtasks];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(subtask =>
        subtask.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        subtask.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        subtask.taskName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        subtask.projectName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(subtask => subtask.status === statusFilter);
    }

    return filtered;
  }, [subtasks, searchQuery, statusFilter]);

  const handleCreateSubtask = () => {
    setSelectedSubtask(null);
    setIsModalOpen(true);
  };

  const handleEditSubtask = (subtask) => {
    setSelectedSubtask(subtask);
    setIsModalOpen(true);
  };

  const handleDeleteSubtask = async (id) => {
    if (!confirm('Are you sure you want to delete this subtask?')) {
      return;
    }

    try {
      await subtaskService.delete(id);
      setSubtasks(prev => prev.filter(subtask => subtask.Id !== id));
      toast.success('Subtask deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete subtask. Please try again.');
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedSubtask(null);
    loadSubtasks(); // Refresh the list
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'Completed':
        return 'success';
      case 'In Progress':
        return 'warning';
      case 'Blocked':
        return 'error';
      default:
        return 'secondary';
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadSubtasks} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Subtasks</h1>
          <p className="text-gray-600">Manage your project subtasks</p>
        </div>
        <Button onClick={handleCreateSubtask} className="flex items-center gap-2">
          <ApperIcon name="Plus" size={16} />
          New Subtask
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <ApperIcon 
                name="Search" 
                size={16} 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
              />
              <input
                type="text"
                placeholder="Search subtasks..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="sm:w-48">
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="Not Started">Not Started</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Blocked">Blocked</option>
            </select>
          </div>
        </div>
      </div>

      {/* Subtasks List */}
      {filteredSubtasks.length === 0 ? (
        <Empty 
          title="No subtasks found"
          description={searchQuery || statusFilter !== 'all' ? 
            "Try adjusting your search or filters." : 
            "Create your first subtask to get started."
          }
          action={{
            label: 'New Subtask',
            onClick: handleCreateSubtask
          }}
        />
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="divide-y divide-gray-200">
            {filteredSubtasks.map((subtask) => (
              <motion.div
                key={subtask.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-medium text-gray-900 truncate">
                        {subtask.name}
                      </h3>
                      <Badge variant={getStatusBadgeVariant(subtask.status)}>
                        {subtask.status}
                      </Badge>
                    </div>
                    
                    {subtask.description && (
                      <p className="text-gray-600 mb-3 line-clamp-2">
                        {subtask.description}
                      </p>
                    )}
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      {subtask.taskName && (
                        <div className="flex items-center gap-1">
                          <ApperIcon name="CheckSquare" size={14} />
                          <span>Task: {subtask.taskName}</span>
                        </div>
                      )}
                      {subtask.projectName && (
                        <div className="flex items-center gap-1">
                          <ApperIcon name="ClipboardList" size={14} />
                          <span>Project: {subtask.projectName}</span>
                        </div>
                      )}
                      {subtask.createdAt && (
                        <div className="flex items-center gap-1">
                          <ApperIcon name="Calendar" size={14} />
                          <span>Created: {format(new Date(subtask.createdAt), 'MMM d, yyyy')}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditSubtask(subtask)}
                    >
                      <ApperIcon name="Edit" size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteSubtask(subtask.Id)}
                      className="text-error hover:text-error hover:bg-red-50"
                    >
                      <ApperIcon name="Trash2" size={16} />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Modal */}
      <SubTaskModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        subtask={selectedSubtask}
      />
    </div>
  );
};

export default SubTasksView;