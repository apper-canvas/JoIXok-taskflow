import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { 
  Plus, 
  Calendar, 
  Clock, 
  Check, 
  Trash2, 
  AlertCircle, 
  ArrowUp, 
  Filter, 
  X,
  Edit3
} from "lucide-react";

const MainFeature = ({ tasks, onAddTask, onToggleTask, onDeleteTask }) => {
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "medium"
  });
  
  const [filter, setFilter] = useState("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  
  const formRef = useRef(null);
  const filterMenuRef = useRef(null);
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (formRef.current && !formRef.current.contains(event.target)) {
        setIsFormOpen(false);
      }
      if (filterMenuRef.current && !filterMenuRef.current.contains(event.target)) {
        setIsFilterMenuOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!newTask.title.trim()) return;
    
    const taskToAdd = {
      id: editingTask ? editingTask.id : Date.now().toString(),
      title: newTask.title,
      description: newTask.description,
      dueDate: newTask.dueDate,
      priority: newTask.priority,
      isCompleted: editingTask ? editingTask.isCompleted : false,
      createdAt: editingTask ? editingTask.createdAt : new Date().toISOString()
    };
    
    if (editingTask) {
      onDeleteTask(editingTask.id);
      setEditingTask(null);
    }
    
    onAddTask(taskToAdd);
    
    // Reset form
    setNewTask({
      title: "",
      description: "",
      dueDate: "",
      priority: "medium"
    });
    
    setIsFormOpen(false);
  };
  
  const handleEditTask = (task) => {
    setEditingTask(task);
    setNewTask({
      title: task.title,
      description: task.description || "",
      dueDate: task.dueDate || "",
      priority: task.priority
    });
    setIsFormOpen(true);
  };
  
  const filteredTasks = tasks.filter(task => {
    if (filter === "all") return true;
    if (filter === "completed") return task.isCompleted;
    if (filter === "pending") return !task.isCompleted;
    if (filter === "high") return task.priority === "high";
    if (filter === "medium") return task.priority === "medium";
    if (filter === "low") return task.priority === "low";
    return true;
  });
  
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high": return "text-accent";
      case "medium": return "text-primary";
      case "low": return "text-secondary";
      default: return "text-surface-500";
    }
  };
  
  const getPriorityIcon = (priority) => {
    switch (priority) {
      case "high": 
        return <ArrowUp size={16} className="text-accent" />;
      case "medium": 
        return <ArrowUp size={16} className="text-primary" />;
      case "low": 
        return <ArrowUp size={16} className="text-secondary" />;
      default: 
        return null;
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-surface-900 dark:text-white">
          My Tasks
        </h2>
        
        <div className="flex items-center gap-3">
          <div className="relative" ref={filterMenuRef}>
            <button
              onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
              className="btn-outline flex items-center gap-2"
            >
              <Filter size={16} />
              <span>Filter</span>
            </button>
            
            <AnimatePresence>
              {isFilterMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 z-10"
                >
                  <div className="py-1">
                    {["all", "completed", "pending", "high", "medium", "low"].map((option) => (
                      <button
                        key={option}
                        onClick={() => {
                          setFilter(option);
                          setIsFilterMenuOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-surface-100 dark:hover:bg-surface-700 ${
                          filter === option 
                            ? "bg-primary/10 text-primary dark:bg-primary/20" 
                            : "text-surface-700 dark:text-surface-300"
                        }`}
                      >
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setEditingTask(null);
              setNewTask({
                title: "",
                description: "",
                dueDate: "",
                priority: "medium"
              });
              setIsFormOpen(true);
            }}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={18} />
            <span>Add Task</span>
          </motion.button>
        </div>
      </div>
      
      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div 
              ref={formRef}
              className="card p-6 mb-6 border-t-4 border-t-primary"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">
                  {editingTask ? "Edit Task" : "New Task"}
                </h3>
                <button 
                  onClick={() => setIsFormOpen(false)}
                  className="p-1 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700"
                >
                  <X size={20} className="text-surface-500" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={newTask.title}
                    onChange={handleInputChange}
                    placeholder="What needs to be done?"
                    className="input"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={newTask.description}
                    onChange={handleInputChange}
                    placeholder="Add details about this task..."
                    className="input min-h-[80px]"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="dueDate" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                      Due Date
                    </label>
                    <input
                      type="date"
                      id="dueDate"
                      name="dueDate"
                      value={newTask.dueDate}
                      onChange={handleInputChange}
                      className="input"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="priority" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                      Priority
                    </label>
                    <select
                      id="priority"
                      name="priority"
                      value={newTask.priority}
                      onChange={handleInputChange}
                      className="input"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="btn-outline"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                  >
                    {editingTask ? "Update Task" : "Add Task"}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {filteredTasks.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="card p-8 text-center"
        >
          <div className="flex justify-center mb-4">
            <div className="p-4 rounded-full bg-surface-100 dark:bg-surface-800">
              <AlertCircle size={32} className="text-surface-400" />
            </div>
          </div>
          <h3 className="text-xl font-semibold mb-2">No tasks found</h3>
          <p className="text-surface-500 dark:text-surface-400 mb-6">
            {filter === "all" 
              ? "You don't have any tasks yet. Create your first task to get started!"
              : `No ${filter} tasks found. Try a different filter or create a new task.`}
          </p>
          <button
            onClick={() => {
              setEditingTask(null);
              setNewTask({
                title: "",
                description: "",
                dueDate: "",
                priority: "medium"
              });
              setIsFormOpen(true);
            }}
            className="btn-primary inline-flex items-center gap-2"
          >
            <Plus size={18} />
            <span>Create Task</span>
          </button>
        </motion.div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {filteredTasks.map((task) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                layout
                className={`card p-4 ${task.isCompleted ? 'bg-surface-50/50 dark:bg-surface-800/50' : ''} task-priority-${task.priority}`}
              >
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => onToggleTask(task.id)}
                    className={`mt-1 flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                      task.isCompleted 
                        ? 'bg-primary border-primary' 
                        : 'border-surface-300 dark:border-surface-600 hover:border-primary'
                    }`}
                  >
                    {task.isCompleted && <Check size={14} className="text-white" />}
                  </button>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <h3 className={`text-lg font-medium ${
                        task.isCompleted 
                          ? 'line-through text-surface-500 dark:text-surface-400' 
                          : 'text-surface-900 dark:text-white'
                      }`}>
                        {task.title}
                      </h3>
                      
                      <div className="flex items-center gap-1 text-xs font-medium">
                        <span className={`px-2 py-1 rounded-full flex items-center gap-1 ${
                          getPriorityColor(task.priority)
                        } bg-${task.priority === 'high' ? 'accent' : task.priority === 'medium' ? 'primary' : 'secondary'}/10`}>
                          {getPriorityIcon(task.priority)}
                          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                        </span>
                      </div>
                    </div>
                    
                    {task.description && (
                      <p className={`mt-1 text-sm ${
                        task.isCompleted 
                          ? 'text-surface-500 dark:text-surface-500' 
                          : 'text-surface-600 dark:text-surface-400'
                      }`}>
                        {task.description}
                      </p>
                    )}
                    
                    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-surface-500">
                      {task.dueDate && (
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          <span>Due: {format(new Date(task.dueDate), "MMM d, yyyy")}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-1">
                        <Clock size={14} />
                        <span>Created: {format(new Date(task.createdAt), "MMM d, yyyy")}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-2">
                    <button
                      onClick={() => handleEditTask(task)}
                      className="p-1.5 rounded-full text-surface-500 hover:text-primary hover:bg-surface-100 dark:hover:bg-surface-700"
                      aria-label="Edit task"
                    >
                      <Edit3 size={16} />
                    </button>
                    
                    <button
                      onClick={() => onDeleteTask(task.id)}
                      className="p-1.5 rounded-full text-surface-500 hover:text-accent hover:bg-surface-100 dark:hover:bg-surface-700"
                      aria-label="Delete task"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default MainFeature;