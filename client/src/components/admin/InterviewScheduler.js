import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';

const InterviewScheduler = () => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [autoAssigning, setAutoAssigning] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [autoCreating, setAutoCreating] = useState(false);

  // Form states for creating slots
  const [slotForm, setSlotForm] = useState({
    startDate: '',
    endDate: '',
    timeSlots: [
      { start: '09:00', end: '09:30', interviewer: '' },
      { start: '10:00', end: '10:30', interviewer: '' },
      { start: '11:00', end: '11:30', interviewer: '' },
      { start: '14:00', end: '14:30', interviewer: '' },
      { start: '15:00', end: '15:30', interviewer: '' },
      { start: '16:00', end: '16:30', interviewer: '' }
    ]
  });

  useEffect(() => {
    fetchSlots();
  }, [selectedDate]);

  const fetchSlots = async () => {
    try {
      setLoading(true);
      const filters = {};
      if (selectedDate) filters.date = selectedDate;
      
      const response = await adminService.getInterviewSlots(filters);
      setSlots(response);
      setError(null);
    } catch (err) {
      console.error('Error fetching slots:', err);
      setError('Failed to load interview slots');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSlots = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await adminService.createInterviewSlots(slotForm);
      setShowCreateModal(false);
      await fetchSlots();
      
      // Reset form
      setSlotForm({
        startDate: '',
        endDate: '',
        timeSlots: [
          { start: '09:00', end: '09:30', interviewer: '' },
          { start: '10:00', end: '10:30', interviewer: '' },
          { start: '11:00', end: '11:30', interviewer: '' },
          { start: '14:00', end: '14:30', interviewer: '' },
          { start: '15:00', end: '15:30', interviewer: '' },
          { start: '16:00', end: '16:30', interviewer: '' }
        ]
      });
    } catch (err) {
      console.error('Error creating slots:', err);
      setError('Failed to create interview slots');
    } finally {
      setLoading(false);
    }
  };

  const handleAutoAssign = async () => {
    try {
      setAutoAssigning(true);
      const response = await adminService.autoAssignInterviews();
      alert(`${response.message}`);
      await fetchSlots();
    } catch (err) {
      console.error('Error auto-assigning interviews:', err);
      alert('Failed to auto-assign interviews: ' + (err.response?.data?.error || err.message));
    } finally {
      setAutoAssigning(false);
    }
  };

  const handleAutoCreateSlots = async () => {
    try {
      setAutoCreating(true);
      const response = await adminService.autoCreateSlots({ daysAhead: 7, slotsPerDay: 6 });
      alert(`${response.message}`);
      await fetchSlots();
    } catch (err) {
      console.error('Error auto-creating slots:', err);
      alert('Failed to auto-create slots: ' + (err.response?.data?.error || err.message));
    } finally {
      setAutoCreating(false);
    }
  };

  const handleExportInterviews = async () => {
    try {
      setExporting(true);
      const csvData = await adminService.exportInterviewData();
      
      // Create download link
      const blob = new Blob([csvData], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `interviews_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error exporting interviews:', err);
      alert('Failed to export interview data');
    } finally {
      setExporting(false);
    }
  };

  const addTimeSlot = () => {
    setSlotForm(prev => ({
      ...prev,
      timeSlots: [...prev.timeSlots, { start: '', end: '', interviewer: '' }]
    }));
  };

  const removeTimeSlot = (index) => {
    setSlotForm(prev => ({
      ...prev,
      timeSlots: prev.timeSlots.filter((_, i) => i !== index)
    }));
  };

  const updateTimeSlot = (index, field, value) => {
    setSlotForm(prev => ({
      ...prev,
      timeSlots: prev.timeSlots.map((slot, i) => 
        i === index ? { ...slot, [field]: value } : slot
      )
    }));
  };

  const groupSlotsByDate = (slots) => {
    return slots.reduce((acc, slot) => {
      const date = new Date(slot.date).toDateString();
      if (!acc[date]) acc[date] = [];
      acc[date].push(slot);
      return acc;
    }, {});
  };

  const groupedSlots = groupSlotsByDate(slots);

  if (loading && slots.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto"></div>
          <p className="text-gray-400 mt-2">Loading interview slots...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Interview Scheduler
          </h2>
          <p className="text-gray-400 mt-1">Manage interview slots and assignments</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Create Slots
          </button>
          <button
            onClick={handleAutoCreateSlots}
            disabled={autoCreating}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-600 text-white rounded-lg transition-colors"
          >
            {autoCreating ? 'Creating...' : 'Auto Create'}
          </button>
          <button
            onClick={handleAutoAssign}
            disabled={autoAssigning}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded-lg transition-colors"
          >
            {autoAssigning ? 'Assigning...' : 'Auto Assign'}
          </button>
          <button
            onClick={handleExportInterviews}
            disabled={exporting}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white rounded-lg transition-colors"
          >
            {exporting ? 'Exporting...' : 'Export CSV'}
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Filter by Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-3 py-2 bg-black/50 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={() => setSelectedDate('')}
              className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
            >
              Clear Filter
            </button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/20 border border-red-500/50 text-red-300 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Slots Display */}
      {Object.keys(groupedSlots).length === 0 ? (
        <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl p-8 text-center">
          <div className="text-6xl mb-4">📅</div>
          <p className="text-gray-400 text-lg">No interview slots found</p>
          <p className="text-sm text-gray-500 mt-2">Create some slots to get started</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedSlots).map(([date, dateSlots]) => (
            <div key={date} className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4">
                {new Date(date).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {dateSlots.map((slot) => (
                  <div
                    key={slot._id}
                    className={`p-4 rounded-lg border ${
                      slot.isBooked
                        ? 'bg-green-900/20 border-green-500/50'
                        : 'bg-gray-900/20 border-gray-500/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-medium">
                        {slot.startTime} - {slot.endTime}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        slot.isBooked
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-500 text-white'
                      }`}>
                        {slot.isBooked ? 'Booked' : 'Available'}
                      </span>
                    </div>
                    
                    <div className="text-sm text-gray-300 space-y-1">
                      <p><strong>Interviewer:</strong> {slot.interviewer || 'TBD'}</p>
                      {slot.isBooked && slot.applicationId && (
                        <>
                          <p><strong>Candidate:</strong> {slot.applicationId.name}</p>
                          <p><strong>Role:</strong> {slot.applicationId.role}</p>
                        </>
                      )}
                      {slot.meetingLink && (
                        <p>
                          <strong>Meeting:</strong> 
                          <a 
                            href={slot.meetingLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 ml-1"
                          >
                            Join Link
                          </a>
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Slots Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold text-white mb-4">Create Interview Slots</h3>
            
            <form onSubmit={handleCreateSlots} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={slotForm.startDate}
                    onChange={(e) => setSlotForm(prev => ({ ...prev, startDate: e.target.value }))}
                    className="w-full px-3 py-2 bg-black/50 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={slotForm.endDate}
                    onChange={(e) => setSlotForm(prev => ({ ...prev, endDate: e.target.value }))}
                    className="w-full px-3 py-2 bg-black/50 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-gray-300">
                    Time Slots
                  </label>
                  <button
                    type="button"
                    onClick={addTimeSlot}
                    className="text-blue-400 hover:text-blue-300 text-sm"
                  >
                    + Add Slot
                  </button>
                </div>
                
                <div className="space-y-3">
                  {slotForm.timeSlots.map((slot, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <input
                        type="time"
                        value={slot.start}
                        onChange={(e) => updateTimeSlot(index, 'start', e.target.value)}
                        className="px-3 py-2 bg-black/50 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                      <span className="text-gray-400">to</span>
                      <input
                        type="time"
                        value={slot.end}
                        onChange={(e) => updateTimeSlot(index, 'end', e.target.value)}
                        className="px-3 py-2 bg-black/50 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                      <input
                        type="text"
                        value={slot.interviewer}
                        onChange={(e) => updateTimeSlot(index, 'interviewer', e.target.value)}
                        placeholder="Interviewer"
                        className="flex-1 px-3 py-2 bg-black/50 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => removeTimeSlot(index)}
                        className="text-red-400 hover:text-red-300 p-1"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  {loading ? 'Creating...' : 'Create Slots'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewScheduler;
