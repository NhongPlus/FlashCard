import { getAuth, onAuthStateChanged, type User } from "@firebase/auth";
import { useEffect, useState } from "react";
import { app } from "../../config/firebase";

interface UseAuthResult {
    user: User | null;
    loading: boolean;
    isAuthenticated: boolean;
}

function useAuth(): UseAuthResult {
    const auth = getAuth(app);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true); // Bắt đầu với loading = true

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log(user.uid);
                setUser(user);
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        // cleanup subscription khi component unmount
        return () => unsubscribe();
    }, [auth]);

    return {
        loading,
        user,
        isAuthenticated: !!user
    };
}

export default useAuth;