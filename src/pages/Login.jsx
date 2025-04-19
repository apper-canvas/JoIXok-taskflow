import { motion } from "framer-motion";
import Auth from "../components/Auth";

const Login = () => {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-md mx-auto">
                <motion.div
                    initial={{
                        opacity: 0, y: -20
                    }} animate={{
                        opacity: 1, y: 0
                    }} transition={{
                        duration: 0.5
                    }} className="text-center mb-8"
                >
                    <h1 className="text-3xl font-bold mb-2 text-surface-900 dark:text-white">
                        Welcome to TaskFlow
                    </h1>
                    <p className="text-surface-600 dark:text-surface-400">
                        Sign in or create an account to get started
                    </p>
                </motion.div>

                <motion.div
                    initial={{
                        opacity: 0
                    }} animate={{
                        opacity: 1
                    }} transition={{
                        duration: 0.5, delay: 0.2
                    }} className="card p-6"
                >
                    <Auth />
                </motion.div>
            </div>
        </div>
    );
};

export default Login;