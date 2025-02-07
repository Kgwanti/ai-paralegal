
import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import ChatInterface from "../components/ChatInterface";
import { Bell, Mail, Send } from "lucide-react";

interface Reminder {
  id: string;
  title: string;
  date: Date;
  trigger: string;
  clientEmail: string;
}

export default function ClientCommunication() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [title, setTitle] = useState("");
  const [trigger, setTrigger] = useState("");
  const [clientEmail, setClientEmail] = useState("");

  const handleAddReminder = () => {
    if (selectedDate && title && trigger && clientEmail) {
      const newReminder: Reminder = {
        id: Math.random().toString(),
        title,
        date: selectedDate,
        trigger,
        clientEmail
      };
      setReminders([...reminders, newReminder]);
      setTitle("");
      setTrigger("");
      setClientEmail("");
      setSelectedDate(undefined);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Sidebar />
      
      <main className="pl-64 min-h-screen">
        <div className="max-w-5xl mx-auto px-8 py-12">
          <header className="mb-12 animate-fade-down">
            <p className="text-sm font-medium text-white/60 mb-2">Communications</p>
            <h1 className="text-5xl font-serif mb-4">Client Management</h1>
            <p className="text-lg text-white/60">
              Manage client communications, set reminders, and draft emails with AI assistance.
            </p>
          </header>

          <div className="space-y-8">
            <Tabs defaultValue="reminders" className="w-full">
              <TabsList>
                <TabsTrigger value="reminders">Reminders</TabsTrigger>
                <TabsTrigger value="emails">Emails</TabsTrigger>
              </TabsList>

              <TabsContent value="reminders" className="space-y-4">
                <div className="glass rounded-2xl p-8">
                  <h2 className="text-xl font-medium mb-4">Set New Reminder</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <Input 
                        placeholder="Reminder Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                      />
                      <Input 
                        placeholder="Trigger (e.g., Document Due)"
                        value={trigger}
                        onChange={(e) => setTrigger(e.target.value)}
                      />
                      <Input 
                        placeholder="Client Email"
                        type="email"
                        value={clientEmail}
                        onChange={(e) => setClientEmail(e.target.value)}
                      />
                      <Button onClick={handleAddReminder}>
                        <Bell className="mr-2" />
                        Set Reminder
                      </Button>
                    </div>
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      className="rounded-md border glass"
                    />
                  </div>
                </div>

                <div className="glass rounded-2xl p-8">
                  <h2 className="text-xl font-medium mb-4">Active Reminders</h2>
                  <div className="space-y-2">
                    {reminders.map((reminder) => (
                      <div key={reminder.id} className="flex items-center justify-between p-4 glass rounded-lg">
                        <div>
                          <h3 className="font-medium">{reminder.title}</h3>
                          <p className="text-sm text-white/60">
                            {reminder.date.toLocaleDateString()} - {reminder.trigger}
                          </p>
                          <p className="text-sm text-white/60">{reminder.clientEmail}</p>
                        </div>
                        <Button variant="outline" size="icon">
                          <Bell className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="emails" className="space-y-4">
                <div className="glass rounded-2xl p-8">
                  <div className="flex gap-6 h-[600px]">
                    <div className="flex-1">
                      <ChatInterface
                        initialMessage="Hi! I can help you draft emails to your clients. What would you like to write?"
                      />
                    </div>
                    <div className="w-64">
                      <h3 className="font-medium mb-4">Email Templates</h3>
                      <div className="space-y-2">
                        <Button variant="outline" className="w-full justify-start">
                          <Mail className="mr-2" />
                          Welcome Email
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <Mail className="mr-2" />
                          Follow-up
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <Mail className="mr-2" />
                          Document Request
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <Send className="mr-2" />
                          Custom Draft
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
}
