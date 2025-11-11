import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Bell, MapPin, Phone, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface Notification {
  id: string;
  message: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  is_read: boolean;
  created_at: string;
  blood_request_id: string;
}

interface BloodRequest {
  hospital_name: string;
  location: string;
  contact_number: string;
  blood_type: string;
  units_required: number;
  urgency: string;
}

const DonorNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [requests, setRequests] = useState<Record<string, BloodRequest>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
    setupRealtimeSubscription();
  }, []);

  const fetchNotifications = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get donor ID
      const { data: donor } = await supabase
        .from('donors')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!donor) return;

      // Fetch notifications
      const { data: notifs, error } = await supabase
        .from('donor_notifications')
        .select('*')
        .eq('donor_id', donor.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;

      if (notifs) {
        setNotifications(notifs as Notification[]);
        
        // Fetch associated blood requests
        const requestIds = [...new Set(notifs.map(n => n.blood_request_id))];
        const { data: requestsData } = await supabase
          .from('blood_requests')
          .select('*')
          .in('id', requestIds);

        if (requestsData) {
          const requestsMap: Record<string, BloodRequest> = {};
          requestsData.forEach(req => {
            requestsMap[req.id] = req;
          });
          setRequests(requestsMap);
        }
      }
    } catch (error: any) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel('donor-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'donor_notifications'
        },
        (payload) => {
          const newNotif = payload.new as Notification;
          setNotifications(prev => [newNotif, ...prev]);
          
          // Show browser notification
          if (Notification.permission === 'granted') {
            new Notification('New Blood Request!', {
              body: newNotif.message,
              icon: '/blood-drop-icon.png',
              badge: '/blood-drop-icon.png'
            });
          }
          
          toast.success('New blood request received!', {
            description: 'Check your notifications panel',
          });

          // Fetch the blood request details
          supabase
            .from('blood_requests')
            .select('*')
            .eq('id', newNotif.blood_request_id)
            .single()
            .then(({ data }) => {
              if (data) {
                setRequests(prev => ({ ...prev, [data.id]: data }));
              }
            });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('donor_notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

      if (error) throw error;

      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
      );
    } catch (error: any) {
      toast.error('Failed to mark as read');
    }
  };

  const openInMaps = (location: string, hospitalName: string) => {
    const query = encodeURIComponent(`${hospitalName}, ${location}`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH': return 'bg-red-500';
      case 'MEDIUM': return 'bg-yellow-500';
      case 'LOW': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground">Loading notifications...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-xl border-border bg-card-gradient">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-primary" />
          Blood Request Alerts
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {notifications.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">
            No notifications yet. You'll be alerted when there's a matching blood request.
          </p>
        ) : (
          notifications.map((notification) => {
            const request = requests[notification.blood_request_id];
            return (
              <div
                key={notification.id}
                className={`p-4 rounded-lg border transition-all hover:shadow-md ${
                  notification.is_read ? 'bg-muted/50' : 'bg-card border-primary/30'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge className={getPriorityColor(notification.priority)}>
                        {notification.priority}
                      </Badge>
                      {!notification.is_read && (
                        <Badge variant="outline" className="animate-pulse">
                          New
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm">{notification.message}</p>
                    {request && (
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground pt-2">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{request.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone className="w-4 h-4" />
                          <span>{request.contact_number}</span>
                        </div>
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {new Date(notification.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    {request && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openInMaps(request.location, request.hospital_name)}
                      >
                        <MapPin className="w-4 h-4 mr-1" />
                        Navigate
                      </Button>
                    )}
                    {!notification.is_read && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => markAsRead(notification.id)}
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Mark Read
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
};

export default DonorNotifications;
