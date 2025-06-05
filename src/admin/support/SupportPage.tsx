import React, { useState, useEffect } from 'react';
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
  RefreshCw,
  Loader
} from 'lucide-react';
import { supabase, SupportTicket, TicketMessage } from '../../lib/supabase';
import dayjs from 'dayjs';
import { toast } from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';

const SupportPage = () => {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [filteredTickets, setFilteredTickets] = useState<SupportTicket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [ticketMessages, setTicketMessages] = useState<TicketMessage[]>([]);
  const [replyMessage, setReplyMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  // Fetch tickets from the database
  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('support_tickets')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      if (data) {
        setTickets(data);
        setFilteredTickets(data);
      }
    } catch (error) {
      console.error('Error fetching tickets:', error);
      toast.error('Failed to load support tickets');
    } finally {
      setLoading(false);
    }
  };

  // Fetch messages for a ticket
  const fetchTicketMessages = async (ticketId: number) => {
    try {
      setMessagesLoading(true);
      const { data, error } = await supabase
        .from('ticket_messages')
        .select('*')
        .eq('ticket_id', ticketId)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      
      if (data) {
        setTicketMessages(data);
      }
    } catch (error) {
      console.error('Error fetching ticket messages:', error);
      toast.error('Failed to load messages');
    } finally {
      setMessagesLoading(false);
    }
  };
  
  // Apply filters
  useEffect(() => {
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
  const viewTicketDetails = async (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
    await fetchTicketMessages(ticket.id);
  };

  // Close ticket details
  const closeTicketDetails = () => {
    setSelectedTicket(null);
    setTicketMessages([]);
    setReplyMessage('');
  };

  // Handle sending a reply
  const handleSendReply = async () => {
    if (!replyMessage.trim() || !selectedTicket) return;
    
    try {
      // First, insert the new message
      const { data: messageData, error: messageError } = await supabase
        .from('ticket_messages')
        .insert([
          {
            ticket_id: selectedTicket.id,
            from_type: 'agent',
            name: 'Admin User',
            message: replyMessage,
            created_at: new Date().toISOString()
          }
        ])
        .select();
      
      if (messageError) throw messageError;
      
      // Then, update the ticket status and last_update
      const { error: ticketError } = await supabase
        .from('support_tickets')
        .update({
          status: 'In Progress',
          last_update: new Date().toISOString()
        })
        .eq('id', selectedTicket.id);
      
      if (ticketError) throw ticketError;
      
      // Update the local state
      if (messageData) {
        // Update ticket messages
        setTicketMessages([...ticketMessages, ...messageData]);
        
        // Update selected ticket
        const updatedTicket = {
          ...selectedTicket,
          status: 'In Progress',
          last_update: new Date().toISOString()
        };
        setSelectedTicket(updatedTicket);
        
        // Update tickets list
        setTickets(tickets.map(ticket => 
          ticket.id === selectedTicket.id ? updatedTicket : ticket
        ));
      }
      
      // Clear the reply message
      setReplyMessage('');
      
      toast.success('Reply sent successfully');
    } catch (error) {
      console.error('Error sending reply:', error);
      toast.error('Failed to send reply');
    }
  };

  // Change ticket status
  const changeTicketStatus = async (id: number, status: string) => {
    try {
      const { error } = await supabase
        .from('support_tickets')
        .update({
          status: status,
          last_update: new Date().toISOString()
        })
        .eq('id', id);
      
      if (error) throw error;
      
      // Update tickets list
      const updatedTickets = tickets.map(ticket => {
        if (ticket.id === id) {
          return {...ticket, status, last_update: new Date().toISOString()};
        }
        return ticket;
      });
      setTickets(updatedTickets);
      
      // Update selected ticket if it's the one being modified
      if (selectedTicket && selectedTicket.id === id) {
        setSelectedTicket({
          ...selectedTicket,
          status: status as any,
          last_update: new Date().toISOString()
        });
      }
      
      toast.success(`Ticket status changed to ${status}`);
    } catch (error) {
      console.error('Error changing ticket status:', error);
      toast.error('Failed to update ticket status');
    }
  };

  // Assign ticket
  const assignTicket = async (id: number, assignee: string) => {
    try {
      const { error } = await supabase
        .from('support_tickets')
        .update({
          assigned_to: assignee,
          last_update: new Date().toISOString()
        })
        .eq('id', id);
      
      if (error) throw error;
      
      // Update tickets list
      const updatedTickets = tickets.map(ticket => {
        if (ticket.id === id) {
          return {...ticket, assigned_to: assignee, last_update: new Date().toISOString()};
        }
        return ticket;
      });
      setTickets(updatedTickets);
      
      // Update selected ticket if it's the one being modified
      if (selectedTicket && selectedTicket.id === id) {
        setSelectedTicket({
          ...selectedTicket,
          assigned_to: assignee,
          last_update: new Date().toISOString()
        });
      }
      
      toast.success(`Ticket assigned to ${assignee}`);
    } catch (error) {
      console.error('Error assigning ticket:', error);
      toast.error('Failed to assign ticket');
    }
  };

  // Function to refresh data
  const refreshData = async () => {
    setRefreshing(true);
    await fetchTickets();
    
    // If a ticket is selected, refresh its messages too
    if (selectedTicket) {
      await fetchTicketMessages(selectedTicket.id);
      
      // Get the updated ticket data
      try {
        const { data, error } = await supabase
          .from('support_tickets')
          .select('*')
          .eq('id', selectedTicket.id)
          .single();
        
        if (error) throw error;
        
        if (data) {
          setSelectedTicket(data);
        }
      } catch (error) {
        console.error('Error refreshing ticket details:', error);
      }
    }
    
    toast.success('Data refreshed successfully');
    setRefreshing(false);
  };

  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return dayjs(dateString).format('YYYY-MM-DD HH:mm');
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
            disabled={refreshing}
          >
            <RefreshCw size={18} className={`mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
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
                  <p className="font-medium">{formatDate(selectedTicket.created_at)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Assigned To</p>
                  <p className="font-medium">{selectedTicket.assigned_to || 'Unassigned'}</p>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-6 space-y-6">
              {messagesLoading ? (
                <div className="flex justify-center p-12">
                  <Loader className="animate-spin mr-2" />
                  <span>Loading messages...</span>
                </div>
              ) : ticketMessages.length > 0 ? (
                ticketMessages.map((message) => (
                  <div 
                    key={message.id} 
                    className={`flex ${message.from_type === 'customer' ? 'justify-start' : 'justify-end'}`}
                  >
                    <div className={`max-w-3xl ${
                      message.from_type === 'customer' 
                        ? 'bg-gray-100 text-gray-800' 
                        : 'bg-primary-50 text-gray-800'
                    } p-4 rounded-lg`}>
                      <div className="flex justify-between items-center mb-2">
                        <div className="font-medium flex items-center">
                          <User size={16} className="mr-2" />
                          {message.name}
                          <span className="text-xs ml-2 text-gray-500">
                            {message.from_type === 'customer' ? '(Customer)' : '(Agent)'}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500">{formatDate(message.created_at)}</div>
                      </div>
                      <p className="text-gray-700">{message.message}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No messages found for this ticket
                </div>
              )}
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
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <Loader size={40} className="text-gray-400 mb-2 animate-spin" />
                        <h3 className="text-lg font-medium text-gray-900">Loading tickets...</h3>
                      </div>
                    </td>
                  </tr>
                ) : filteredTickets.length > 0 ? (
                  filteredTickets.map(ticket => (
                    <tr key={ticket.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <button 
                          className="font-medium text-primary-600 hover:text-primary-800 text-left"
                          onClick={() => viewTicketDetails(ticket)}
                        >
                          #{ticket.id} - {ticket.subject}
                        </button>
                        <div className="text-xs text-gray-500 mt-1">
                          Created: {formatDate(ticket.created_at)}
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
                        {formatDate(ticket.last_update)}
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
                  ))
                ) : (
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