import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getApperClient, getApperUI } from "../services/ApperService";

/**
 * Authentication component that renders the Apper login and signup UI
 */
const Auth = () => {
    const navigate = useNavigate();
    const authContainerRef = useRef(null);

    useEffect(() => {
        if (!authContainerRef.current) return;

        const apperClient = getApperClient();
        const ApperUI = getApperUI();

        ApperUI.setup(apperClient, {
            target: '#authentication',
            clientId: "fe8afe16b11848e4be5de15a745566ff",
            hide: [], // Authentication methods to hide (if any)
            view: 'both', // 'login', 'signup', or 'both'
            onSuccess: function (user, account) {
                // Store user details in localStorage for reference across the application
                console.log(user)
                localStorage.setItem('apperUser', JSON.stringify(user.data));

                // Navigate to dashboard/home after successful authentication
                navigate('/');
            },
            onError: function (error) {
                // Handle authentication errors
                console.error("Authentication failed:", error);

            }
        });

        ApperUI.showLogin("#authentication");

        return () => {
            // Cleanup when component unmounts
            //ApperUI.hide();
        };
    }, [navigate]);

    return (
        <div
            id="authentication"
            ref={authContainerRef
            } className="min-h-[400px] flex items-center justify-center"
        />
    );
};

export default Auth;