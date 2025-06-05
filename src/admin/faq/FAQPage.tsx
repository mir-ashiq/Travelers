import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Edit2, Trash2, Plus, Search, ChevronDown, ChevronUp, AlertCircle, X, Loader } from 'lucide-react';
import { supabase, FAQ } from '../../lib/supabase';
import { toast } from 'react-hot-toast';

const FAQPage = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [editingFAQ, setEditingFAQ] = useState<FAQ | null>(null);
  const [newFAQ, setNewFAQ] = useState({
    question: '',
    answer: '',
    category: 'General',
    published: true
  });
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);

  // Fetch FAQs from Supabase
  useEffect(() => {
    fetchFAQs();
  }, []);

  const fetchFAQs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('faqs')
        .select('*')
        .order('id', { ascending: true });
      
      if (error) throw error;
      
      if (data) {
        setFaqs(data);
        // Extract unique categories
        const uniqueCategories = [...new Set(data.map(faq => faq.category))];
        setCategories(uniqueCategories);
      }
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      toast.error('Failed to load FAQs');
    } finally {
      setLoading(false);
    }
  };

  // Filter FAQs
  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = 
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesCategory = categoryFilter ? faq.category === categoryFilter : true;
    
    return matchesSearch && matchesCategory;
  });

  // Toggle FAQ expansion
  const toggleFAQ = (id: number) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  // Start editing FAQ
  const startEdit = (faq: FAQ) => {
    setEditingFAQ({ ...faq });
    setExpandedFAQ(faq.id);
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingFAQ(null);
  };

  // Save edited FAQ
  const saveFAQ = async () => {
    if (!editingFAQ || !editingFAQ.question || !editingFAQ.answer) return;
    
    try {
      const { error } = await supabase
        .from('faqs')
        .update({
          question: editingFAQ.question,
          answer: editingFAQ.answer,
          category: editingFAQ.category,
          published: editingFAQ.published
        })
        .eq('id', editingFAQ.id);
      
      if (error) throw error;
      
      setFaqs(faqs.map(faq => faq.id === editingFAQ.id ? editingFAQ : faq));
      setEditingFAQ(null);
      
      toast.success('FAQ updated successfully');
    } catch (error) {
      console.error('Error updating FAQ:', error);
      toast.error('Failed to update FAQ');
    }
  };

  // Delete FAQ
  const deleteFAQ = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this FAQ?')) {
      try {
        const { error } = await supabase
          .from('faqs')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
        
        setFaqs(faqs.filter(faq => faq.id !== id));
        toast.success('FAQ deleted successfully');
      } catch (error) {
        console.error('Error deleting FAQ:', error);
        toast.error('Failed to delete FAQ');
      }
    }
  };

  // Toggle FAQ published status
  const togglePublished = async (id: number) => {
    try {
      const faqToUpdate = faqs.find(faq => faq.id === id);
      if (!faqToUpdate) return;
      
      const newStatus = !faqToUpdate.published;
      
      const { error } = await supabase
        .from('faqs')
        .update({ published: newStatus })
        .eq('id', id);
      
      if (error) throw error;
      
      setFaqs(faqs.map(faq => {
        if (faq.id === id) {
          return { ...faq, published: newStatus };
        }
        return faq;
      }));
      
      toast.success(`FAQ ${newStatus ? 'published' : 'unpublished'} successfully`);
    } catch (error) {
      console.error('Error updating FAQ status:', error);
      toast.error('Failed to update FAQ status');
    }
  };

  // Add new FAQ
  const addNewFAQ = async () => {
    if (!newFAQ.question || !newFAQ.answer) return;
    
    try {
      const { data, error } = await supabase
        .from('faqs')
        .insert([
          {
            question: newFAQ.question,
            answer: newFAQ.answer,
            category: newFAQ.category,
            published: newFAQ.published
          }
        ])
        .select();
      
      if (error) throw error;
      
      if (data) {
        setFaqs([...faqs, ...data]);
        setNewFAQ({
          question: '',
          answer: '',
          category: 'General',
          published: true
        });
        setIsAddingNew(false);
        
        toast.success('New FAQ added successfully');
      }
    } catch (error) {
      console.error('Error adding FAQ:', error);
      toast.error('Failed to add FAQ');
    }
  };

  // Handle form input change for new FAQ
  const handleNewFAQChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewFAQ({
      ...newFAQ,
      [name]: value
    });
  };

  // Handle checkbox change for new FAQ
  const handleNewFAQCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setNewFAQ({
      ...newFAQ,
      [name]: checked
    });
  };

  // Handle form input change for editing FAQ
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (!editingFAQ) return;
    const { name, value } = e.target;
    setEditingFAQ({
      ...editingFAQ,
      [name]: value
    });
  };

  // Handle checkbox change for editing FAQ
  const handleEditCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editingFAQ) return;
    const { name, checked } = e.target;
    setEditingFAQ({
      ...editingFAQ,
      [name]: checked
    });
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setCategoryFilter('');
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Manage FAQs</h1>
          <p className="text-gray-600">Add, edit, and manage frequently asked questions</p>
        </div>
        <button 
          onClick={() => setIsAddingNew(true)}
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg inline-flex items-center"
        >
          <Plus size={18} className="mr-2" />
          Add New FAQ
        </button>
      </div>
      
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search FAQs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          
          <div className="md:w-64 relative">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="appearance-none bg-white w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Categories</option>
              {categories.map((category, index) => (
                <option key={index} value={category}>{category}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <ChevronDown size={16} className="text-gray-500" />
            </div>
          </div>
          
          {(searchTerm || categoryFilter) && (
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
      
      {/* Add New FAQ Form */}
      {isAddingNew && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Add New FAQ</h2>
            <button 
              onClick={() => setIsAddingNew(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-1">
                Question
              </label>
              <input
                type="text"
                id="question"
                name="question"
                value={newFAQ.question}
                onChange={handleNewFAQChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="e.g. What is the best time to visit Kashmir?"
                required
              />
            </div>
            
            <div>
              <label htmlFor="answer" className="block text-sm font-medium text-gray-700 mb-1">
                Answer
              </label>
              <textarea
                id="answer"
                name="answer"
                value={newFAQ.answer}
                onChange={handleNewFAQChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Provide a detailed answer..."
                required
              ></textarea>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={newFAQ.category}
                  onChange={handleNewFAQChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                >
                  {categories.map((category, index) => (
                    <option key={index} value={category}>{category}</option>
                  ))}
                  <option value="New Category">New Category</option>
                </select>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="published"
                  name="published"
                  checked={newFAQ.published}
                  onChange={handleNewFAQCheckboxChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="published" className="ml-2 block text-sm text-gray-700">
                  Publish on website
                </label>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <button 
                type="button"
                onClick={() => setIsAddingNew(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                type="button"
                onClick={addNewFAQ}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                disabled={!newFAQ.question || !newFAQ.answer}
              >
                Add FAQ
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* FAQs List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <Loader className="animate-spin mr-2" />
            <span>Loading FAQs...</span>
          </div>
        ) : filteredFAQs.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {filteredFAQs.map(faq => (
              <div key={faq.id} className="p-6">
                {editingFAQ && editingFAQ.id === faq.id ? (
                  // Edit Mode
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="edit-question\" className="block text-sm font-medium text-gray-700 mb-1">
                        Question
                      </label>
                      <input
                        type="text"
                        id="edit-question"
                        name="question"
                        value={editingFAQ.question}
                        onChange={handleEditChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="edit-answer" className="block text-sm font-medium text-gray-700 mb-1">
                        Answer
                      </label>
                      <textarea
                        id="edit-answer"
                        name="answer"
                        value={editingFAQ.answer}
                        onChange={handleEditChange}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        required
                      ></textarea>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="edit-category" className="block text-sm font-medium text-gray-700 mb-1">
                          Category
                        </label>
                        <select
                          id="edit-category"
                          name="category"
                          value={editingFAQ.category}
                          onChange={handleEditChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                          required
                        >
                          {categories.map((category, index) => (
                            <option key={index} value={category}>{category}</option>
                          ))}
                          <option value="New Category">New Category</option>
                        </select>
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="edit-published"
                          name="published"
                          checked={editingFAQ.published}
                          onChange={handleEditCheckboxChange}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <label htmlFor="edit-published" className="ml-2 block text-sm text-gray-700">
                          Publish on website
                        </label>
                      </div>
                    </div>
                    
                    <div className="flex justify-end space-x-2 pt-4">
                      <button 
                        type="button"
                        onClick={cancelEdit}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button 
                        type="button"
                        onClick={saveFAQ}
                        className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                        disabled={!editingFAQ.question || !editingFAQ.answer}
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <div>
                    <div className="flex justify-between">
                      <button 
                        className="text-lg font-medium text-left flex items-center"
                        onClick={() => toggleFAQ(faq.id)}
                      >
                        {expandedFAQ === faq.id ? (
                          <ChevronUp size={20} className="mr-2 text-primary-600" />
                        ) : (
                          <ChevronDown size={20} className="mr-2 text-primary-600" />
                        )}
                        {faq.question}
                      </button>
                      <div className="flex items-center space-x-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${faq.published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {faq.published ? 'Published' : 'Draft'}
                        </span>
                        <div className="flex space-x-1">
                          <button 
                            className="text-indigo-600 hover:text-indigo-900 p-1"
                            onClick={() => startEdit(faq)}
                            title="Edit FAQ"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button 
                            className="text-red-600 hover:text-red-900 p-1"
                            onClick={() => deleteFAQ(faq.id)}
                            title="Delete FAQ"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {expandedFAQ === faq.id && (
                      <div className="mt-4">
                        <div className="text-gray-600 mb-4">{faq.answer}</div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">Category: <span className="font-medium">{faq.category}</span></span>
                          <button
                            onClick={() => togglePublished(faq.id)}
                            className={`text-sm px-3 py-1 rounded-md ${
                              faq.published 
                                ? 'bg-red-50 text-red-600 hover:bg-red-100' 
                                : 'bg-green-50 text-green-600 hover:bg-green-100'
                            }`}
                          >
                            {faq.published ? 'Unpublish' : 'Publish'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <AlertCircle size={48} className="text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No FAQs found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FAQPage;