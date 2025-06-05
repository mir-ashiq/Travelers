import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  ChevronDown, 
  MessageSquare, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  User,
  X,
  Send,
  ArrowLeft,
  Paperclip,
  RefreshCw
} from 'lucide-react';

// Mock support ticket data
const mockTickets = [
  {
    id: 1001,
    subject: 'Cancellation request for Kashmir Bliss Package',
    customer: 'Rahul Sharma',
    email: 'rahul.s@example.com',
    status: 'Open',
    priority: 'High',
    category: 'Booking',
    createdAt: '2025-06-01 14:30',
    assignedTo: 'Zara Khan',
    lastUpdate: '2025-06-01 14:30',
    messages: [
      {
        id: 1,
        from: 'customer',
        name: 'Rahul Sharma',
        message: 'I need to cancel my Kashmir Bliss tour package booking due to a family emergency. The booking was made last week for travel dates June 15-20, 2025. Please confirm the cancellation policy and the amount that will be refunded.',
        time: '2025-06-01 14:30'
      }
    ]
  },
  {
    id: 1002,
    subject: 'Request for customization of Ladakh itinerary',
    customer: 'Priya Singh',
    email: 'priya.s@example.com',
    status: 'In Progress',
    priority: 'Medium',
    category: 'Customization',
    createdAt: '2025-05-30 11:15',
    assignedTo: 'Priya Kaul',
    lastUpdate: '2025-05-31 09:45',
    messages: [
      {
        id: 1,
        from: 'customer',
        name: 'Priya Singh',
        message: 'I am interested in the Ladakh Adventure package but would like to add an extra day for acclimatization and also include a visit to Tso Moriri lake. Is this possible and what would be the additional cost?',
        time: '2025-05-30 11:15'
      },
      {
        id: 2,
        from: 'agent',
        name: 'Priya Kaul',
        message: `Hello Priya, thank you for your interest in our Ladakh Adventure package. Yes, we can definitely customize the itinerary to include an extra day for acclimatization and a visit to Tso Moriri lake. The additional cost would be approximately ₹8,000 per person. Would you like me to prepare a detailed customized itinerary for you?`,
        time: '2025-05-30 14:30'
      },
      {
        id: 3,
        from: 'customer',
        name: 'Priya Singh',
        message: 'That sounds good. Yes, please prepare a detailed itinerary with the changes. Also, would we need any additional permits for Tso Moriri?',
        time: '2025-05-31 09:45'
      }
    ]
  },
  {
    id: 1003,
    subject: 'Query regarding Gurez Valley tour prerequisites',
    customer: 'Ajay Patel',
    email: 'ajay.p@example.com',
    status: 'Closed',
    priority: 'Low',
    category: 'Information',
    createdAt: '2025-05-25 16:20',
    assignedTo: 'Raj Gupta',
    lastUpdate: '2025-05-27 10:10',
    messages: [
      {
        id: 1,
        from: 'customer',
        name: 'Ajay Patel',
        message: 'I am planning to book the Gurez Valley Explorer tour. Are there any specific permits required for Indian citizens? Also, what is the mobile network availability in the region?',
        time: '2025-05-25 16:20'
      },
      {
        id: 2,
        from: 'agent',
        name: 'Raj Gupta',
        message: `Hello Ajay, thank you for your interest in our Gurez Valley Explorer tour. For Indian citizens, a valid government ID proof is sufficient. However, foreign nationals require an Inner Line Permit. Regarding mobile connectivity, only BSNL network works in some parts of Gurez Valley. We recommend informing your family about limited connectivity during the tour. Let me know if you have any other questions!`,
        time: '2025-05-26 09:30'
      },
      {
        id: 3,
        from: 'customer',
        name: 'Ajay Patel',
        message: 'Thank you for the information. This is really helpful. I will proceed with the booking soon.',
        time: '2025-05-26 15:45'
      },
      {
        id: 4,
        from: 'agent',
        name: 'Raj Gupta',
        message: "You're welcome, Ajay! We're excited to have you experience the beautiful Gurez Valley. Feel free to reach out if you have any other questions or when you're ready to book.",
        time: '2025-05-27 10:10'
      }
    ]
  },
  {
    id: 1004,
    subject: 'Issue with payment for booking #3042',
    customer: 'Sarah Wilson',
    email: 'sarah.w@example.com',
    status: 'Open',
    priority: 'High',
    category: 'Payment',
    createdAt: '2025-06-02 08:15',
    assignedTo: 'Unassigned',
    lastUpdate: '2025-06-02 08:15',
    messages: [
      {
        id: 1,
        from: 'customer',
        name: 'Sarah Wilson',
        message: 'I tried to make a payment for my booking #3042 (Jammu Heritage Tour) but the transaction failed twice. However, the amount was debited from my account both times. Please help resolve this issue as soon as possible.',
        time: '2025-06-02 08:15'
      }
    ]
  }
];

const SupportPage = () => {
  const [tickets, setTickets] = useState(mockTickets);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [filteredTickets, setFilteredTickets] = useState(tickets);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Apply filters
  React.useEffect(() => {
    let results = [...tickets];
    
    if (searchTerm) {
      results = results.filter(ticket => 
        ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter) {
      results = results.filter(ticket => ticket.status === statusFilter);
    }
    
    if (priorityFilter) {
      results = results.filter(ticket => ticket.priority === priorityFilter);
    }
    
    if (categoryFilter) {
      results = results.filter(ticket => ticket.category === categoryFilter);
    }
    
    setFilteredTickets(results);
  }, [searchTerm, statusFilter, priorityFilter, categoryFilter, tickets]);

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setPriorityFilter('');
    setCategoryFilter('');
  };

  // View ticket details
  const viewTicketDetails = (ticket: any) => {
    setSelectedTicket(ticket);
  };

  // Close ticket details
  const closeTicketDetails = () => {
    setSelectedTicket(null);
    setReplyMessage('');
  };

  // Handle sending a reply
  const handleSendReply = () => {
    if (!replyMessage.trim()) return;
    
    // Create a new message
    const newMessage = {
      id: selectedTicket.messages.length + 1,
      from: 'agent',
      name: 'Admin User',
      message: replyMessage,
      time: new Date().toLocaleString()
    };
    
    // Create an updated ticket with the new message
    const updatedTicket = {
      ...selectedTicket,
      messages: [...selectedTicket.messages, newMessage],
      lastUpdate: new Date().toLocaleString(),
      status: 'In Progress' // Automatically change status to In Progress when replying
    };
    
    // Update the tickets state
    setTickets(tickets.map(ticket => 
      ticket.id === selectedTicket.id ? updatedTicket : ticket
    ));
    
    // Update the selected ticket
    setSelectedTicket(updatedTicket);
    
    // Clear the reply message
    setReplyMessage('');
    
    // Show success message
    alert('Reply sent successfully!');
  };

  // Change ticket status
  const changeTicketStatus = (id: number, status: string) => {
    // Update the tickets state
    setTickets(tickets.map(ticket => {
      if (ticket.id === id) {
        // Show success message
        alert(`Ticket status changed to ${status}!`);
        return {...ticket, status, lastUpdate: new Date().toLocaleString()};
      }
      return ticket;
    }));
    
    // Update selected ticket if it's the one being modified
    if (selectedTicket && selectedTicket.id === id) {
      setSelectedTicket({
        ...selectedTicket, 
        status,
        lastUpdate: new Date().toLocaleString()
      });
    }
  };

  // Assign ticket
  const assignTicket = (id: number, assignee: string) => {
    setTickets(tickets.map(ticket => {
      if (ticket.id === id) {
        // Show success message
        alert(`Ticket assigned to ${assignee}!`);
        return {...ticket, assignedTo: assignee, lastUpdate: new Date().toLocaleString()};
      }
      return ticket;
    }));
    
    if (selectedTicket && selectedTicket.id === id) {
      setSelectedTicket({
        ...selectedTicket, 
        assignedTo: assignee,
        lastUpdate: new Date().toLocaleString()
      });
    }
  };

  // Function to refresh data
  const refreshData = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert('Data refreshed successfully!');
    }, 800);
  };

  // Get status color class
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Open':
        return 'bg-yellow-100 text-yellow-800';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'Closed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Get priority color class
  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'High':
        return 'bg-red-100 text-red-800';
      case 'Medium':
        return 'bg-orange-100 text-orange-800';
      case 'Low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Available agents for assignment
  const agents = [
    { id: 1, name: 'Priya Kaul' },
    { id: 2, name: 'Raj Gupta' },
    { id: 3, name: 'Zara Khan' },
    { id: 4, name: 'Aarav Sharma' }
  ];
  
  // State for assignment dropdown
  const [showAssignDropdown, setShowAssignDropdown] = useState(false);

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Support Tickets</h1>
          <p className="text-gray-600">Manage customer support inquiries and requests</p>
        </div>
        <div className="flex space-x-2">
          <button
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg inline-flex items-center"
            onClick={refreshData}
          >
            <RefreshCw size={18} className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>
      
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search tickets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          
          <div className="md:w-48 relative">
            <Filter size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none bg-white w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Statuses</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Closed">Closed</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <ChevronDown size={16} className="text-gray-500" />
            </div>
          </div>
          
          <div className="md:w-48 relative">
            <Filter size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="appearance-none bg-white w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Priorities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <ChevronDown size={16} className="text-gray-500" />
            </div>
          </div>
          
          <div className="md:w-48 relative">
            <Filter size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="appearance-none bg-white w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Categories</option>
              <option value="Booking">Booking</option>
              <option value="Customization">Customization</option>
              <option value="Payment">Payment</option>
              <option value="Information">Information</option>
              <option value="Complaint">Complaint</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <ChevronDown size={16} className="text-gray-500" />
            </div>
          </div>
          
          {(searchTerm || statusFilter || priorityFilter || categoryFilter) && (
            <button
              onClick={clearFilters}
              className="flex items-center px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
            >
              <X size={16} className="mr-2" />
              Clear Filters
            </button>
          )}
        </div>
      </div>
      
      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">All Tickets</p>
              <p className="text-2xl font-bold">{tickets.length}</p>
            </div>
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <MessageSquare size={20} />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Open</p>
              <p className="text-2xl font-bold text-yellow-600">{tickets.filter(t => t.status === 'Open').length}</p>
            </div>
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <AlertCircle size={20} />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">In Progress</p>
              <p className="text-2xl font-bold text-blue-600">{tickets.filter(t => t.status === 'In Progress').length}</p>
            </div>
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <Clock size={20} />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Closed</p>
              <p className="text-2xl font-bold text-green-600">{tickets.filter(t => t.status === 'Closed').length}</p>
            </div>
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <CheckCircle size={20} />
            </div>
          </div>
        </div>
      </div>
      
      {selectedTicket ? (
        // Ticket Detail View
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="flex justify-between items-center p-4 border-b border-gray-200">
            <button 
              onClick={closeTicketDetails}
              className="inline-flex items-center text-gray-700 hover:text-gray-900"
            >
              <ArrowLeft size={16} className="mr-2" />
              Back to tickets
            </button>
            
            <div className="flex space-x-2">
              <div className="relative">
                <button 
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 inline-flex items-center"
                  onClick={() => setShowAssignDropdown(!showAssignDropdown)}
                >
                  Assign
                  <ChevronDown size={16} className="ml-2" />
                </button>
                
                {showAssignDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg overflow-hidden z-20">
                    <div className="py-1">
                      {agents.map(agent => (
                        <button
                          key={agent.id}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => {
                            assignTicket(selectedTicket.id, agent.name);
                            setShowAssignDropdown(false);
                          }}
                        >
                          {agent.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {selectedTicket.status !== 'Closed' ? (
                <button 
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                  onClick={() => changeTicketStatus(selectedTicket.id, 'Closed')}
                >
                  <CheckCircle size={16} className="mr-2 inline" />
                  Mark as Resolved
                </button>
              ) : (
                <button 
                  className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700"
                  onClick={() => changeTicketStatus(selectedTicket.id, 'Open')}
                >
                  <AlertCircle size={16} className="mr-2 inline" />
                  Reopen Ticket
                </button>
              )}
            </div>
          </div>
          
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-2">{selectedTicket.subject}</h2>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedTicket.status)}`}>
                  {selectedTicket.status}
                </span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(selectedTicket.priority)}`}>
                  {selectedTicket.priority} Priority
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {selectedTicket.category}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 bg-gray-50 p-4 rounded-lg">
                <div>
                  <p className="text-xs text-gray-500">Customer</p>
                  <p className="font-medium">{selectedTicket.customer}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="font-medium">{selectedTicket.email}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Created</p>
                  <p className="font-medium">{selectedTicket.createdAt}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Assigned To</p>
                  <p className="font-medium">{selectedTicket.assignedTo || 'Unassigned'}</p>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-6 space-y-6">
              {selectedTicket.messages.map((message: any) => (
                <div 
                  key={message.id} 
                  className={`flex ${message.from === 'customer' ? 'justify-start' : 'justify-end'}`}
                >
                  <div className={`max-w-3xl ${
                    message.from === 'customer' 
                      ? 'bg-gray-100 text-gray-800' 
                      : 'bg-primary-50 text-gray-800'
                  } p-4 rounded-lg`}>
                    <div className="flex justify-between items-center mb-2">
                      <div className="font-medium flex items-center">
                        <User size={16} className="mr-2" />
                        {message.name}
                        <span className="text-xs ml-2 text-gray-500">
                          {message.from === 'customer' ? '(Customer)' : '(Agent)'}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">{message.time}</div>
                    </div>
                    <p className="text-gray-700">{message.message}</p>
                  </div>
                </div>
              ))}
            </div>
            
            {selectedTicket.status !== 'Closed' && (
              <div className="mt-8 border-t border-gray-200 pt-6">
                <h3 className="font-medium mb-4">Reply to this ticket</h3>
                <div className="mb-4">
                  <textarea 
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Type your response here..."
                    rows={4}
                  ></textarea>
                </div>
                <div className="flex justify-between">
                  <button className="inline-flex items-center text-gray-700 hover:text-gray-900">
                    <Paperclip size={18} className="mr-2" />
                    Attach File
                  </button>
                  <div className="space-x-2">
                    <button 
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                      onClick={() => setReplyMessage('')}
                    >
                      Cancel
                    </button>
                    <button 
                      className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 inline-flex items-center"
                      onClick={handleSendReply}
                      disabled={!replyMessage.trim()}
                    >
                      <Send size={18} className="mr-2" />
                      Send Reply
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        // Tickets Table
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ticket
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Update
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredTickets.map(ticket => (
                  <tr key={ticket.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <button 
                        className="font-medium text-primary-600 hover:text-primary-800 text-left"
                        onClick={() => viewTicketDetails(ticket)}
                      >
                        #{ticket.id} - {ticket.subject}
                      </button>
                      <div className="text-xs text-gray-500 mt-1">
                        Created: {ticket.createdAt}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="font-medium">{ticket.customer}</div>
                      <div className="text-xs text-gray-500">{ticket.email}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                        {ticket.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {ticket.category}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {ticket.lastUpdate}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right space-x-2">
                      <button 
                        className="text-primary-600 hover:text-primary-900"
                        onClick={() => viewTicketDetails(ticket)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                      {ticket.status !== 'Closed' && (
                        <button 
                          className="text-green-600 hover:text-green-900"
                          onClick={() => changeTicketStatus(ticket.id, 'Closed')}
                          title="Mark as Resolved"
                        >
                          <CheckCircle size={18} />
                        </button>
                      )}
                      {ticket.status === 'Closed' && (
                        <button 
                          className="text-yellow-600 hover:text-yellow-900"
                          onClick={() => changeTicketStatus(ticket.id, 'Open')}
                          title="Reopen Ticket"
                        >
                          <AlertCircle size={18} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                
                {filteredTickets.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <AlertCircle size={40} className="text-gray-400 mb-2" />
                        <h3 className="text-lg font-medium text-gray-900">No tickets found</h3>
                        <p className="text-gray-500">Try adjusting your search or filters</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3">
            <div className="flex-1 flex justify-between sm:hidden">
              <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Previous
              </button>
              <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredTickets.length}</span> of{' '}
                  <span className="font-medium">{filteredTickets.length}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <span className="sr-only">Previous</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    1
                  </button>
                  <button
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <span className="sr-only">Next</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupportPage;