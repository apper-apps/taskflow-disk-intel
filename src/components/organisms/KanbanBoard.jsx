import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import TaskCard from '@/components/molecules/TaskCard';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import ApperIcon from '@/components/ApperIcon';
import { taskService } from '@/services/api/taskService';

const KanbanBoard = ({ 
  projectId, 
  searchQuery, 
  filters, 
  onTaskEdit,
  onTaskCreate 
}) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const columns = [
    { id: 'ToDo', title: 'To Do', color: 'bg-blue-50 border-blue-200' },
    { id: 'InProgress', title: 'In Progress', color: 'bg-yellow-50 border-yellow-200' },
    { id: 'Done', title: 'Done', color: 'bg-green-50 border-green-200' }
  ];

  useEffect(() => {
    loadTasks();
  }, [projectId]);

  const loadTasks = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = projectId 
        ? await taskService.getByProject(projectId)
        : await taskService.getAll();
      setTasks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;
    
    if (source.droppableId === destination.droppableId) return;

    const taskId = parseInt(draggableId);
    const newStatus = destination.droppableId;

    try {
      const task = tasks.find(t => t.Id === taskId);
      const updatedTask = await taskService.update(taskId, { 
        ...task, 
        status: newStatus 
      });
      
      setTasks(tasks.map(t => t.Id === taskId ? updatedTask : t));
      toast.success(`Task moved to ${newStatus === 'ToDo' ? 'To Do' : newStatus === 'InProgress' ? 'In Progress' : 'Done'}`);
    } catch (err) {
      toast.error('Failed to update task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!confirm('Are you sure you want to delete this task?')) return;

    try {
      await taskService.delete(taskId);
      setTasks(tasks.filter(task => task.Id !== taskId));
      toast.success('Task deleted successfully');
    } catch (err) {
      toast.error('Failed to delete task');
    }
  };

  const handleToggleStatus = async (taskId) => {
    try {
      const task = tasks.find(t => t.Id === taskId);
      const newStatus = task.status === 'Done' ? 'ToDo' : 'Done';
      
      const updatedTask = await taskService.update(taskId, { 
        ...task, 
        status: newStatus 
      });
      
      setTasks(tasks.map(t => t.Id === taskId ? updatedTask : t));
      toast.success(`Task marked as ${newStatus === 'Done' ? 'completed' : 'pending'}`);
    } catch (err) {
      toast.error('Failed to update task');
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = !searchQuery || 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = !filters.status || filters.status === 'all' || task.status === filters.status;
    const matchesPriority = !filters.priority || filters.priority === 'all' || task.priority === filters.priority;
    const matchesProject = !filters.project || filters.project === 'all' || task.projectId === filters.project;
    
    return matchesSearch && matchesStatus && matchesPriority && matchesProject;
  });

  const getTasksByStatus = (status) => {
    return filteredTasks.filter(task => task.status === status);
  };

  if (loading) return <Loading variant="kanban" />;
  if (error) return <Error message={error} onRetry={loadTasks} variant="tasks" />;

  if (filteredTasks.length === 0) {
    if (searchQuery || Object.values(filters).some(v => v && v !== 'all')) {
      return <Empty variant="search" />;
    }
    return <Empty variant="tasks" onAction={onTaskCreate} actionText="Create First Task" />;
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map((column) => {
          const columnTasks = getTasksByStatus(column.id);
          
          return (
            <div key={column.id} className={`rounded-lg border-2 ${column.color} p-4`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 flex items-center">
                  <ApperIcon 
                    name={column.id === 'ToDo' ? 'Circle' : column.id === 'InProgress' ? 'Clock' : 'CheckCircle'} 
                    size={16} 
                    className="mr-2" 
                  />
                  {column.title}
                </h3>
                <span className="bg-white px-2 py-1 rounded-full text-sm font-medium text-gray-600">
                  {columnTasks.length}
                </span>
              </div>

              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`space-y-3 min-h-[200px] rounded-lg p-2 transition-colors ${
                      snapshot.isDraggingOver ? 'bg-white/50' : ''
                    }`}
                  >
                    <AnimatePresence>
                      {columnTasks.map((task, index) => (
                        <Draggable key={task.Id} draggableId={task.Id.toString()} index={index}>
                          {(provided, snapshot) => (
                            <motion.div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              layout
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -20 }}
                              transition={{ duration: 0.2 }}
                            >
                              <TaskCard
                                task={task}
                                onEdit={onTaskEdit}
                                onDelete={handleDeleteTask}
                                onToggleStatus={handleToggleStatus}
                                isDragging={snapshot.isDragging}
                                className={snapshot.isDragging ? 'shadow-lg rotate-2' : ''}
                              />
                            </motion.div>
                          )}
                        </Draggable>
                      ))}
                    </AnimatePresence>
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
};

export default KanbanBoard;