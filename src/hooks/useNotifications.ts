import { useState, useEffect } from 'react';
import { setupAPIClient } from '@/services/api';
import { Notification } from 'Types/types'; 

export function useNotifications(userId?: string) {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [hasUnread, setHasUnread] = useState(false);
    const apiClient = setupAPIClient();

    const fetchNotifications = async () => {
        try {
            if (!userId) return;
            
            const response = await apiClient.get(`/user/notifications?user_id=${userId}`);
            const fetchedNotifications = response.data.slice(0, 20);
            setNotifications(fetchedNotifications);
            setHasUnread(fetchedNotifications.some((notification: { read: any; }) => !notification.read));
        } catch (error) {
            console.error("Erro ao buscar notificações:", error);
        }
    };

    const checkForNewNotifications = async () => {
        try {
            if (!userId) return;
            
            const response = await apiClient.get(`/user/notifications?user_id=${userId}`);
            const newNotifications = response.data.slice(0, 20);
            setNotifications(newNotifications);
        } catch (error) {
            console.error("Erro ao verificar novas notificações:", error);
        }
    };

    const markAsRead = async (id: string) => {
        try {
            await apiClient.put(`/notifications/mark-read?notificationUser_id=${id}`);
            setNotifications(prev =>
                prev.map(notification =>
                    notification.id === id ? { ...notification, read: true } : notification
                )
            );
            setHasUnread(notifications.some(n => n.id !== id && !n.read));
        } catch (error) {
            console.error("Erro ao marcar notificação como lida:", error);
        }
    };

    const markAllAsRead = async () => {
        try {
            if (!userId) return;
            
            await apiClient.put(`/notifications/mark-all-read?user_id=${userId}`);
            setNotifications(prev =>
                prev.map(notification => ({ ...notification, read: true }))
            );
            setHasUnread(false);
        } catch (error) {
            console.error("Erro ao marcar todas como lidas:", error);
        }
    };

    useEffect(() => {
        fetchNotifications();

        const interval = setInterval(() => {
            checkForNewNotifications();
        }, 20000);

        return () => clearInterval(interval);
    }, [userId]);

    useEffect(() => {
        setHasUnread(notifications.some(notification => !notification.read));
    }, [notifications]);

    return {
        notifications,
        hasUnread,
        fetchNotifications,
        markAsRead,
        markAllAsRead
    };
}