import { router } from '@inertiajs/react';
import { useCallback, useRef, useState } from 'react';
import {
    clearFirebaseClientAuth,
    mapFirebaseAuthError,
    signInWithGoogleIdToken,
} from '../lib/firebase';

/**
 * Shared Google-via-Firebase login flow for Inertia pages.
 */
export default function useFirebaseGoogleAuth({ remember = false } = {}) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const inFlight = useRef(false);

    const authenticate = useCallback(async () => {
        if (inFlight.current) {
            return;
        }

        inFlight.current = true;
        setIsLoading(true);
        setError(null);

        try {
            const { idToken } = await signInWithGoogleIdToken();

            await new Promise((resolve, reject) => {
                router.post(
                    route('auth.firebase.google'),
                    {
                        id_token: idToken,
                        remember,
                    },
                    {
                        preserveScroll: true,
                        onSuccess: () => resolve(),
                        onError: (errors) => {
                            const message =
                                errors?.id_token ||
                                Object.values(errors || {})[0] ||
                                'Google authentication failed. Please try again.';
                            const normalized = Array.isArray(message) ? message[0] : message;
                            setError(normalized);
                            reject(new Error(normalized));
                        },
                        onCancel: () => reject(new Error('cancelled')),
                    },
                );
            });
        } catch (err) {
            if (err?.message === 'cancelled') {
                // Inertia visit cancelled; keep any prior error.
            } else if (err?.code || err?.message?.includes('Firebase') || err?.message?.includes('popup')) {
                setError(mapFirebaseAuthError(err));
            } else if (!err?.message?.startsWith('An account') && !err?.message?.startsWith('Google')) {
                setError(mapFirebaseAuthError(err));
            }

            await clearFirebaseClientAuth();
        } finally {
            inFlight.current = false;
            setIsLoading(false);
        }
    }, [remember]);

    return {
        authenticate,
        isLoading,
        error,
        setError,
        clearFirebaseClientAuth,
    };
}
