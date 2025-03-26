'use client';

import { useEffect } from 'react';
import { setupAPIClient } from "@/services/api";

interface ViewCounterProps {
    postId: string;
}

export default function ViewCounter({ postId }: ViewCounterProps) {
    useEffect(() => {
        const registerView = async () => {
            try {
                await setupAPIClient().patch(`/post/${postId}/views`);
            } catch (error) {
                console.error('Error registering view:', error);
            }
        };

        if (postId) {
            registerView();
        }
    }, [postId]);

    return null;
}