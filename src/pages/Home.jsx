import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ListChecks, BarChart3 } from "lucide-react";
import MainFeature from "../components/MainFeature";

const Home = () => {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    highPriority: 0
  });

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    
    // Calculate stats
    const completed = tasks.filter(task => task.isCompleted).length;
    const highPriority = tasks.filter(task => task.priority === "high").length;
    
    setStats({
      total: tasks.length,
      completed,
      pending: tasks.length - completed,
      highPriority
    });
  }, [tasks]);

  const addTask = (newTask) => {
    setTasks([...tasks, newTask]);
  };

  const toggleTaskCompletion = (taskId) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, isCompleted: !task.isCompleted } 
        : task
    ));
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-2 text-surface-900 dark:text-white">
          Welcome to TaskFlow
        </h1>
        <p className="text-surface-600 dark:text-surface-400 mb-8">
          Organize your tasks and boost your productivity
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="card p-6"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-primary/10 text-primary">
              <ListChecks size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Total Tasks</h3>
              <p className="text-3xl font-bold">{stats.total}</p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="card p-6"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-secondary/10 text-secondary">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Completed</h3>
              <p className="text-3xl font-bold">{stats.completed}</p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="card p-6"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-accent/10 text-accent">
              <BarChart3 size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold">High Priority</h3>
              <p className="text-3xl font-bold">{stats.highPriority}</p>
            </div>
          </div>
        </motion.div>
      </div>

      <MainFeature 
        tasks={tasks} 
        onAddTask={addTask} 
        onToggleTask={toggleTaskCompletion}
        onDeleteTask={deleteTask}
      />
    </div>
  );
};

export default Home;