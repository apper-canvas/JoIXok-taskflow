import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, ListChecks, BarChart3 } from "lucide-react";
import MainFeature from "../components/MainFeature";
import TaskService from "../services/TaskService";
import StatsService from "../services/StatsService";

const Home = () => {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    highPriority: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load tasks and statistics when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const tasksData = await TaskService.fetchTasks();
        setTasks(tasksData);

        // Calculate stats from tasks
        const calculatedStats = StatsService.calculateStats(tasksData);
        setStats(calculatedStats);

        // Save the calculated stats to the database
        await StatsService.updateStats(calculatedStats);
      } catch (error) {
        console.error("Error loading data:", error);
        setError("Failed to load tasks. Please try again later.");
      } finally {
        setLoading(false);

      }
    };

    fetchData();
  }, []);

  // Add new task to the database and update local state
  const addTask = async (newTask) => {
    try {
      // Create task in the database
      const createdTask = await TaskService.createTask(newTask);

      // Update local state
      const updatedTasks = [...tasks, createdTask];
      setTasks(updatedTasks);

      // Update statistics
      const updatedStats = StatsService.calculateStats(updatedTasks);
      setStats(updatedStats);
      await StatsService.updateStats(updatedStats);
    } catch (error) {
      console.error("Error adding task:", error);
      // Show error to user (could be implemented with a toast notification)

    }
  };

  // Toggle task completion status
  const toggleTaskCompletion = async (taskId) => {
    try {
      const taskToToggle = tasks.find(task => task.id === taskId);
      if (!taskToToggle) return;

      // Update in the database
      await TaskService.toggleTaskCompletion(taskId, taskToToggle.isCompleted);

      // Update local state
      const updatedTasks = tasks.map(task =>
        task.id === taskId
          ? { ...task, isCompleted: !task.isCompleted }
          : task
      );
      setTasks(updatedTasks);

      // Update statistics
      const updatedStats = StatsService.calculateStats(updatedTasks);
      setStats(updatedStats);
      await StatsService.updateStats(updatedStats);
    } catch (error) {
      console.error("Error toggling task completion:", error);

    }
  };

  // Delete a task
  const deleteTask = async (taskId) => {
    try {
      // Delete from the database
      await TaskService.deleteTask(taskId);

      // Update local state
      const updatedTasks = tasks.filter(task => task.id !== taskId);
      setTasks(updatedTasks);

      // Update statistics
      const updatedStats = StatsService.calculateStats(updatedTasks);
      setStats(updatedStats);
      await StatsService.updateStats(updatedStats);
    } catch (error) {
      console.error("Error deleting task:", error);

    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );


  } if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="card p-6 text-center text-accent">
          <h2 className="text-xl font-semibold mb-2">{error}</h2>
          <button
            onClick={() => window.location.reload()
            } className="btn-primary mt-4"
          >
            Try Again
          </button>
        </div>
      </div>
    );


  } return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{
          opacity: 0, y: 20
        }} animate={{
          opacity: 1, y: 0
        }} transition={{
          duration: 0.5
        }}      >
        <h1 className="text-3xl font-bold mb-2 text-surface-900 dark:text-white">
          Welcome to TaskFlow
        </h1>
        <p className="text-surface-600 dark:text-surface-400 mb-8">
          Organize your tasks and boost your productivity
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{
            opacity: 0, y: 20
          }} animate={{
            opacity: 1, y: 0
          }} transition={{
            duration: 0.5, delay: 0.1
          }} className="card p-6"
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
          initial={{
            opacity: 0, y: 20
          }} animate={{
            opacity: 1, y: 0
          }} transition={{
            duration: 0.5, delay: 0.2
          }} className="card p-6"
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
          initial={{
            opacity: 0, y: 20
          }} animate={{
            opacity: 1, y: 0
          }} transition={{
            duration: 0.5, delay: 0.3
          }} className="card p-6"
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
        onToggleTask={toggleTaskCompletion
        } onDeleteTask={deleteTask
        } />
    </div>
  );
};

export default Home;