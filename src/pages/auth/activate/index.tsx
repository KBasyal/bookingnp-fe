import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { LoadingComponent } from '../../../components/common';

const ActivateUser = () => {
    const { token } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const activateAccount = async () => {
            try {
                // Send the token to the backend for activation
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/auth/activate/${token}`);
                
                if (response) {
                    toast.success('Account activated successfully!');
                    navigate('/'); // Redirect to login page
                } else {
                    toast.error('Failed to activate account. Please try again or contact support.');
                }
            } catch (exception: any) {
                console.log('Activation error:', exception);
            }
        };

        activateAccount();
    }, [token, navigate]);

    return <LoadingComponent/>
};

export default ActivateUser;
