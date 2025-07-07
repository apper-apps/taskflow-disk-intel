import React, { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-toastify";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import TaskCard from "@/components/molecules/TaskCard";
import { taskService } from "@/services/api/taskService";
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {columns.map((column, columnIndex) => {
          const columnTasks = getTasksByStatus(column.id);
          
          return (
            <motion.div 
              key={column.id} 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: columnIndex * 0.1 }}
              className="relative rounded-2xl p-6 overflow-hidden"
              style={{
                background: `
                  linear-gradient(145deg, 
                    rgba(255, 255, 255, 0.9) 0%,
                    rgba(248, 250, 252, 0.95) 25%,
                    rgba(241, 245, 249, 0.3) 50%,
                    rgba(255, 255, 255, 0.9) 100%
                  )
                `,
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                boxShadow: `
                  0 10px 25px rgba(0, 0, 0, 0.08),
                  0 4px 15px rgba(0, 0, 0, 0.05),
                  inset 1px 1px 0 rgba(255, 255, 255, 0.2)
                `,
              }}
            >
              {/* Column accent */}
              <div 
                className="absolute top-0 left-0 right-0 h-1 opacity-60"
                style={{
                  background: column.id === 'ToDo' 
                    ? 'linear-gradient(90deg, #94a3b8, #64748b)'
                    : column.id === 'InProgress'
                    ? 'linear-gradient(90deg, #3b82f6, #2563eb)'
                    : 'linear-gradient(90deg, #10b981, #059669)',
                }}
              />
              
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{
                      background: column.id === 'ToDo' 
                        ? 'linear-gradient(135deg, rgba(148, 163, 184, 0.15), rgba(100, 116, 139, 0.1))'
                        : column.id === 'InProgress'
                        ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(37, 99, 235, 0.1))'
                        : 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(5, 150, 105, 0.1))',
                      backdropFilter: 'blur(10px)',
                      border: column.id === 'ToDo' 
                        ? '1px solid rgba(148, 163, 184, 0.2)'
                        : column.id === 'InProgress'
                        ? '1px solid rgba(59, 130, 246, 0.2)'
                        : '1px solid rgba(16, 185, 129, 0.2)',
                    }}
                  >
                    <ApperIcon 
                      name={column.id === 'ToDo' ? 'Circle' : column.id === 'InProgress' ? 'Clock' : 'CheckCircle'} 
                      size={20} 
                      className={
                        column.id === 'ToDo' 
                          ? 'text-slate-600'
                          : column.id === 'InProgress'
                          ? 'text-blue-600'
                          : 'text-green-600'
                      }
                    />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {column.title}
                  </h3>
                </div>
                
                <div 
                  className="px-3 py-1.5 rounded-xl text-sm font-bold"
                  style={{
                    background: column.id === 'ToDo' 
                      ? 'rgba(148, 163, 184, 0.15)'
                      : column.id === 'InProgress'
                      ? 'rgba(59, 130, 246, 0.15)'
                      : 'rgba(16, 185, 129, 0.15)',
                    color: column.id === 'ToDo' 
                      ? '#475569'
                      : column.id === 'InProgress'
                      ? '#2563eb'
                      : '#059669',
                    border: column.id === 'ToDo' 
                      ? '1px solid rgba(148, 163, 184, 0.2)'
                      : column.id === 'InProgress'
                      ? '1px solid rgba(59, 130, 246, 0.2)'
                      : '1px solid rgba(16, 185, 129, 0.2)',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  {columnTasks.length}
                </div>
              </div>

              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={cn(
                      'space-y-4 min-h-[300px] rounded-xl p-3 transition-all duration-300',
                      snapshot.isDraggingOver && 'bg-white/30 scale-105'
                    )}
                    style={{
                      backdropFilter: snapshot.isDraggingOver ? 'blur(10px)' : 'none',
                      border: snapshot.isDraggingOver ? '2px dashed rgba(59, 130, 246, 0.3)' : '2px dashed transparent',
                    }}
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
                              transition={{ duration: 0.3 }}
                            >
                              <TaskCard
                                task={task}
                                onEdit={onTaskEdit}
                                onDelete={handleDeleteTask}
                                onToggleStatus={handleToggleStatus}
                                isDragging={snapshot.isDragging}
                                className={snapshot.isDragging ? 'transform rotate-3 scale-105 z-50' : ''}
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
            </motion.div>
          );
        })}
      </div>
    </DragDropContext>
  );
};

export default KanbanBoard;