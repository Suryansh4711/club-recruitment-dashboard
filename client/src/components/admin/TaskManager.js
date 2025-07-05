// client/src/components/admin/TaskManager.js
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import taskService from '../../services/taskService';
import adminService from '../../services/adminService';

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('tasks'); // 'tasks', 'assignments', 'stats'
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [applications, setApplications] = useState([]);

  // Form states
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    difficulty: 'Medium',
    category: 'Programming',
    timeLimit: 60,
    maxScore: 100,
    problemStatement: '',
    constraints: '',
    examples: [{ input: '', output: '', explanation: '' }],
    testCases: [{ input: '', expectedOutput: '', isHidden: false }],
    tags: []
  });

  const [assignmentForm, setAssignmentForm] = useState({
    taskId: '',
    applicationIds: [],
    dueDate: '',
    notes: ''
  });

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      if (activeTab === 'tasks' || activeTab === 'assignments') {
        const [tasksData, assignmentsData] = await Promise.all([
          taskService.getTasks(),
          taskService.getAssignments()
        ]);
        setTasks(tasksData);
        setAssignments(assignmentsData);
      }

      if (activeTab === 'stats') {
        const statsData = await taskService.getAssignmentStats();
        setStats(statsData);
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await taskService.createTask(taskForm);
      setShowCreateModal(false);
      setTaskForm({
        title: '',
        description: '',
        difficulty: 'Medium',
        category: 'Programming',
        timeLimit: 60,
        maxScore: 100,
        problemStatement: '',
        constraints: '',
        examples: [{ input: '', output: '', explanation: '' }],
        testCases: [{ input: '', expectedOutput: '', isHidden: false }],
        tags: []
      });
      await fetchData();
    } catch (err) {
      setError('Failed to create task: ' + err.message);
    }
  };

  const handleAssignTask = async (e) => {
    e.preventDefault();
    try {
      await taskService.assignTask(assignmentForm);
      setShowAssignModal(false);
      setAssignmentForm({
        taskId: '',
        applicationIds: [],
        dueDate: '',
        notes: ''
      });
      await fetchData();
    } catch (err) {
      setError('Failed to assign task: ' + err.message);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskService.deleteTask(taskId);
        await fetchData();
      } catch (err) {
        setError('Failed to delete task: ' + err.message);
      }
    }
  };

  const handleEvaluateAssignment = async (assignmentId, score, feedback) => {
    try {
      await taskService.evaluateAssignment(assignmentId, {
        score,
        feedback,
        evaluatedBy: '507f1f77bcf86cd799439011' // Default admin ID
      });
      await fetchData();
    } catch (err) {
      setError('Failed to evaluate assignment: ' + err.message);
    }
  };

  const loadApplications = async () => {
    try {
      const appsData = await adminService.getApplications({ status: 'Shortlisted', limit: 100 });
      setApplications(appsData.applications);
    } catch (err) {
      console.error('Error loading applications:', err);
    }
  };

  const addExample = () => {
    setTaskForm(prev => ({
      ...prev,
      examples: [...prev.examples, { input: '', output: '', explanation: '' }]
    }));
  };

  const addTestCase = () => {
    setTaskForm(prev => ({
      ...prev,
      testCases: [...prev.testCases, { input: '', expectedOutput: '', isHidden: false }]
    }));
  };

  const updateExample = (index, field, value) => {
    setTaskForm(prev => ({
      ...prev,
      examples: prev.examples.map((ex, i) => i === index ? { ...ex, [field]: value } : ex)
    }));
  };

  const updateTestCase = (index, field, value) => {
    setTaskForm(prev => ({
      ...prev,
      testCases: prev.testCases.map((tc, i) => i === index ? { ...tc, [field]: value } : tc)
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto"></div>
          <p className="text-gray-400 mt-2">Loading task data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Task Manager
          </h2>
          <p className="text-gray-400 mt-1">Create, assign, and manage coding tasks</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            Create Task
          </button>
          <button
            onClick={() => {
              setShowAssignModal(true);
              loadApplications();
            }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Assign Task
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-1 bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl p-1">
        {[
          { id: 'tasks', label: 'Tasks', icon: '📋' },
          { id: 'assignments', label: 'Assignments', icon: '📝' },
          { id: 'stats', label: 'Statistics', icon: '📊' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-purple-700 to-pink-600 text-white shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
            }`}
          >
            <span className="text-lg">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/20 border border-red-500/50 text-red-300 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Tab Content */}
      {activeTab === 'tasks' && (
        <TasksTab 
          tasks={tasks}
          onDelete={handleDeleteTask}
          onAssign={(task) => {
            setSelectedTask(task);
            setAssignmentForm(prev => ({ ...prev, taskId: task._id }));
            setShowAssignModal(true);
            loadApplications();
          }}
        />
      )}

      {activeTab === 'assignments' && (
        <AssignmentsTab 
          assignments={assignments}
          onEvaluate={handleEvaluateAssignment}
        />
      )}

      {activeTab === 'stats' && (
        <StatsTab stats={stats} />
      )}

      {/* Create Task Modal */}
      {showCreateModal && (
        <CreateTaskModal
          taskForm={taskForm}
          setTaskForm={setTaskForm}
          onSubmit={handleCreateTask}
          onClose={() => setShowCreateModal(false)}
          addExample={addExample}
          addTestCase={addTestCase}
          updateExample={updateExample}
          updateTestCase={updateTestCase}
        />
      )}

      {/* Assign Task Modal */}
      {showAssignModal && (
        <AssignTaskModal
          tasks={tasks}
          applications={applications}
          assignmentForm={assignmentForm}
          setAssignmentForm={setAssignmentForm}
          onSubmit={handleAssignTask}
          onClose={() => setShowAssignModal(false)}
          selectedTask={selectedTask}
        />
      )}
    </div>
  );
};

// Tasks Tab Component
const TasksTab = ({ tasks, onDelete, onAssign }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tasks.map((task) => (
        <motion.div
          key={task._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-purple-500/50 transition-all duration-300"
        >
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-lg font-semibold text-white truncate flex-1">{task.title}</h3>
            <div className="flex items-center gap-2 ml-2">
              <span className={`px-2 py-1 rounded-full text-xs text-white ${taskService.getDifficultyColor(task.difficulty)}`}>
                {task.difficulty}
              </span>
            </div>
          </div>
          
          <p className="text-gray-400 text-sm mb-4 line-clamp-3">{task.description}</p>
          
          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Category:</span>
              <span className="text-white">{task.category}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Time Limit:</span>
              <span className="text-white">{taskService.formatTimeLimit(task.timeLimit)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Max Score:</span>
              <span className="text-white">{task.maxScore}</span>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => onAssign(task)}
              className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors"
            >
              Assign
            </button>
            <button
              onClick={() => onDelete(task._id)}
              className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition-colors"
            >
              Delete
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

// Assignments Tab Component
const AssignmentsTab = ({ assignments, onEvaluate }) => {
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [evaluationForm, setEvaluationForm] = useState({ score: '', feedback: '' });

  const handleEvaluate = (assignment) => {
    setSelectedAssignment(assignment);
    setEvaluationForm({ score: '', feedback: '' });
  };

  const submitEvaluation = () => {
    if (selectedAssignment && evaluationForm.score) {
      onEvaluate(selectedAssignment._id, parseInt(evaluationForm.score), evaluationForm.feedback);
      setSelectedAssignment(null);
      setEvaluationForm({ score: '', feedback: '' });
    }
  };

  return (
    <div className="space-y-4">
      {assignments.map((assignment) => (
        <motion.div
          key={assignment._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl p-6"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-2">
                {assignment.taskId?.title || 'Unknown Task'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Candidate:</span>
                  <span className="text-white ml-2">{assignment.candidateName}</span>
                </div>
                <div>
                  <span className="text-gray-400">Due Date:</span>
                  <span className="text-white ml-2">
                    {new Date(assignment.dueDate).toLocaleDateString()}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Status:</span>
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs text-white ${taskService.getStatusColor(assignment.status)}`}>
                    {assignment.status}
                  </span>
                </div>
                {assignment.evaluation?.score && (
                  <div>
                    <span className="text-gray-400">Score:</span>
                    <span className="text-white ml-2">{assignment.evaluation.score}/100</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex gap-2">
              {assignment.status === 'Submitted' && (
                <button
                  onClick={() => handleEvaluate(assignment)}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm transition-colors"
                >
                  Evaluate
                </button>
              )}
              <button
                onClick={() => setSelectedAssignment(assignment)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors"
              >
                View Details
              </button>
            </div>
          </div>
        </motion.div>
      ))}

      {/* Evaluation Modal */}
      {selectedAssignment && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 rounded-xl p-6 w-full max-w-lg">
            <h3 className="text-xl font-semibold text-white mb-4">
              {selectedAssignment.status === 'Submitted' ? 'Evaluate Assignment' : 'Assignment Details'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Task: {selectedAssignment.taskId?.title}
                </label>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Candidate: {selectedAssignment.candidateName}
                </label>
              </div>
              
              {selectedAssignment.status === 'Submitted' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Score (0-100)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={evaluationForm.score}
                      onChange={(e) => setEvaluationForm(prev => ({ ...prev, score: e.target.value }))}
                      className="w-full px-3 py-2 bg-black/50 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Feedback
                    </label>
                    <textarea
                      value={evaluationForm.feedback}
                      onChange={(e) => setEvaluationForm(prev => ({ ...prev, feedback: e.target.value }))}
                      className="w-full px-3 py-2 bg-black/50 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      rows="4"
                      placeholder="Provide feedback for the candidate..."
                    />
                  </div>
                </>
              )}
              
              {selectedAssignment.evaluation && (
                <div className="space-y-2">
                  <div>
                    <span className="text-gray-400">Score:</span>
                    <span className="text-white ml-2">{selectedAssignment.evaluation.score}/100</span>
                  </div>
                  {selectedAssignment.evaluation.feedback && (
                    <div>
                      <span className="text-gray-400">Feedback:</span>
                      <p className="text-white mt-1">{selectedAssignment.evaluation.feedback}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setSelectedAssignment(null)}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Close
              </button>
              {selectedAssignment.status === 'Submitted' && (
                <button
                  onClick={submitEvaluation}
                  disabled={!evaluationForm.score}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  Submit Evaluation
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Stats Tab Component
const StatsTab = ({ stats }) => {
  if (!stats) return <div>Loading statistics...</div>;

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Total Assignments', value: stats.overview.total, icon: '📋', color: 'blue' },
          { label: 'Submitted', value: stats.overview.submitted, icon: '✅', color: 'green' },
          { label: 'Evaluated', value: stats.overview.evaluated, icon: '🎯', color: 'purple' },
          { label: 'Overdue', value: stats.overview.overdue, icon: '⏰', color: 'red' },
          { label: 'Pending', value: stats.overview.pending, icon: '⏳', color: 'yellow' }
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl p-4 text-center"
          >
            <div className="text-3xl mb-2">{stat.icon}</div>
            <div className="text-2xl font-bold text-white">{stat.value}</div>
            <div className="text-sm text-gray-400">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Task Performance */}
      <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Task Performance</h3>
        <div className="space-y-4">
          {stats.taskStats.map((task, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg">
              <div className="flex-1">
                <h4 className="font-medium text-white">{task._id}</h4>
                <div className="flex items-center gap-4 text-sm text-gray-400 mt-1">
                  <span>Assignments: {task.totalAssignments}</span>
                  <span>Submitted: {task.submittedCount}</span>
                  <span>Avg Score: {task.averageScore ? task.averageScore.toFixed(1) : 'N/A'}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-white">
                  {task.totalAssignments > 0 ? Math.round((task.submittedCount / task.totalAssignments) * 100) : 0}%
                </div>
                <div className="text-sm text-gray-400">Completion</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Create Task Modal Component
const CreateTaskModal = ({ taskForm, setTaskForm, onSubmit, onClose, addExample, addTestCase, updateExample, updateTestCase }) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-semibold text-white mb-4">Create New Task</h3>
        
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
              <input
                type="text"
                value={taskForm.title}
                onChange={(e) => setTaskForm(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 bg-black/50 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Difficulty</label>
              <select
                value={taskForm.difficulty}
                onChange={(e) => setTaskForm(prev => ({ ...prev, difficulty: e.target.value }))}
                className="w-full px-3 py-2 bg-black/50 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
              <select
                value={taskForm.category}
                onChange={(e) => setTaskForm(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 bg-black/50 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="Programming">Programming</option>
                <option value="Algorithm">Algorithm</option>
                <option value="Database">Database</option>
                <option value="Web Development">Web Development</option>
                <option value="System Design">System Design</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Time Limit (minutes)</label>
              <input
                type="number"
                value={taskForm.timeLimit}
                onChange={(e) => setTaskForm(prev => ({ ...prev, timeLimit: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 bg-black/50 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                min="1"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Max Score</label>
              <input
                type="number"
                value={taskForm.maxScore}
                onChange={(e) => setTaskForm(prev => ({ ...prev, maxScore: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 bg-black/50 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                min="1"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
            <textarea
              value={taskForm.description}
              onChange={(e) => setTaskForm(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 bg-black/50 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              rows="3"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Problem Statement</label>
            <textarea
              value={taskForm.problemStatement}
              onChange={(e) => setTaskForm(prev => ({ ...prev, problemStatement: e.target.value }))}
              className="w-full px-3 py-2 bg-black/50 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              rows="4"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Constraints</label>
            <textarea
              value={taskForm.constraints}
              onChange={(e) => setTaskForm(prev => ({ ...prev, constraints: e.target.value }))}
              className="w-full px-3 py-2 bg-black/50 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              rows="2"
            />
          </div>
          
          {/* Examples */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-300">Examples</label>
              <button
                type="button"
                onClick={addExample}
                className="text-purple-400 hover:text-purple-300 text-sm"
              >
                + Add Example
              </button>
            </div>
            <div className="space-y-3">
              {taskForm.examples.map((example, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={example.input}
                    onChange={(e) => updateExample(index, 'input', e.target.value)}
                    placeholder="Input"
                    className="px-3 py-2 bg-black/50 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <input
                    type="text"
                    value={example.output}
                    onChange={(e) => updateExample(index, 'output', e.target.value)}
                    placeholder="Output"
                    className="px-3 py-2 bg-black/50 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <input
                    type="text"
                    value={example.explanation}
                    onChange={(e) => updateExample(index, 'explanation', e.target.value)}
                    placeholder="Explanation"
                    className="px-3 py-2 bg-black/50 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              ))}
            </div>
          </div>
          
          {/* Test Cases */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-300">Test Cases</label>
              <button
                type="button"
                onClick={addTestCase}
                className="text-purple-400 hover:text-purple-300 text-sm"
              >
                + Add Test Case
              </button>
            </div>
            <div className="space-y-3">
              {taskForm.testCases.map((testCase, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={testCase.input}
                    onChange={(e) => updateTestCase(index, 'input', e.target.value)}
                    placeholder="Input"
                    className="px-3 py-2 bg-black/50 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <input
                    type="text"
                    value={testCase.expectedOutput}
                    onChange={(e) => updateTestCase(index, 'expectedOutput', e.target.value)}
                    placeholder="Expected Output"
                    className="px-3 py-2 bg-black/50 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={testCase.isHidden}
                      onChange={(e) => updateTestCase(index, 'isHidden', e.target.checked)}
                      className="mr-2"
                    />
                    <label className="text-sm text-gray-300">Hidden</label>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Assign Task Modal Component
const AssignTaskModal = ({ tasks, applications, assignmentForm, setAssignmentForm, onSubmit, onClose, selectedTask }) => {
  const handleApplicationToggle = (appId) => {
    setAssignmentForm(prev => ({
      ...prev,
      applicationIds: prev.applicationIds.includes(appId)
        ? prev.applicationIds.filter(id => id !== appId)
        : [...prev.applicationIds, appId]
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-semibold text-white mb-4">Assign Task to Candidates</h3>
        
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Select Task</label>
            <select
              value={assignmentForm.taskId}
              onChange={(e) => setAssignmentForm(prev => ({ ...prev, taskId: e.target.value }))}
              className="w-full px-3 py-2 bg-black/50 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            >
              <option value="">Choose a task...</option>
              {tasks.map(task => (
                <option key={task._id} value={task._id}>
                  {task.title} ({task.difficulty})
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Due Date</label>
            <input
              type="datetime-local"
              value={assignmentForm.dueDate}
              onChange={(e) => setAssignmentForm(prev => ({ ...prev, dueDate: e.target.value }))}
              className="w-full px-3 py-2 bg-black/50 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Notes</label>
            <textarea
              value={assignmentForm.notes}
              onChange={(e) => setAssignmentForm(prev => ({ ...prev, notes: e.target.value }))}
              className="w-full px-3 py-2 bg-black/50 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              rows="3"
              placeholder="Additional instructions for candidates..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Select Candidates ({assignmentForm.applicationIds.length} selected)
            </label>
            <div className="max-h-60 overflow-y-auto space-y-2">
              {applications.map(app => (
                <div key={app._id} className="flex items-center p-2 bg-gray-800/30 rounded-lg">
                  <input
                    type="checkbox"
                    checked={assignmentForm.applicationIds.includes(app._id)}
                    onChange={() => handleApplicationToggle(app._id)}
                    className="mr-3"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-white">{app.name}</div>
                    <div className="text-sm text-gray-400">
                      {app.role} • {app.branch} • {app.year}th Year
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={assignmentForm.applicationIds.length === 0}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg transition-colors"
            >
              Assign Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskManager;
