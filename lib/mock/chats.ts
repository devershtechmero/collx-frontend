export type Message = {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
};

export type Contact = {
  id: string;
  name: string;
  username: string;
  avatar?: string;
  status: "online" | "offline";
  lastMessage?: string;
  lastActive: string;
};

export const CONTACTS: Contact[] = [
  {
    id: "1",
    name: "Alex Johnson",
    username: "alexj99",
    status: "online",
    lastMessage: "Is that Charizard still available?",
    lastActive: "Just now",
  },
  {
    id: "2",
    name: "Sarah Miller",
    username: "sarah_m",
    status: "offline",
    lastMessage: "Thanks for the trade!",
    lastActive: "2h ago",
  },
  {
    id: "3",
    name: "Mike Ross",
    username: "mikeross88",
    status: "online",
    lastMessage: "I'll send the payment now.",
    lastActive: "15m ago",
  },
  {
    id: "4",
    name: "Emma Wilson",
    username: "emma_w",
    status: "online",
    lastActive: "5h ago",
  },
];

export const INITIAL_MESSAGES: Record<string, Message[]> = {
  "1": [
    { id: "m1", senderId: "1", text: "Hey! I saw your collection.", timestamp: "10:30 AM" },
    { id: "m2", senderId: "me", text: "Hey Alex! Glad you liked it. Anything specific?", timestamp: "10:32 AM" },
    { id: "m3", senderId: "1", text: "Is that Charizard still available?", timestamp: "10:35 AM" },
  ],
  "2": [
    { id: "m4", senderId: "2", text: "The card arrived today! It's in perfect condition.", timestamp: "Yesterday" },
    { id: "m5", senderId: "me", text: "Awesome! Thanks for the trade!", timestamp: "Yesterday" },
  ],
};
