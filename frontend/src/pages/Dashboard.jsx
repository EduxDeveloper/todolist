import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { Plus, Trash2, CheckCircle2, Circle, Edit2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

export default function Dashboard() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [filterPriority, setFilterPriority] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  
  // Form (Create / Edit)
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ title: '', description: '', priority: 'medium', category: 'otro', dueDate: '' });

  const fetchTodos = async () => {
    try {
      let url = '/api/todos';
      if (filterPriority || filterCategory) {
        url = `/api/todos/filter?`;
        if (filterPriority) url += `priority=${filterPriority}&`;
        if (filterCategory) url += `category=${filterCategory}&`;
      }
      
      const res = await axios.get(url);
      setTodos(res.data);
    } catch (error) {
      toast.error('Error fetching todos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, [filterPriority, filterCategory]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`/api/todos/${editingId}`, formData);
        toast.success('Todo updated!');
      } else {
        await axios.post('/api/todos', formData);
        toast.success('Todo created!');
      }
      resetForm();
      fetchTodos();
    } catch (error) {
      toast.error('Error saving todo');
    }
  };

  const toggleTodo = async (id) => {
    try {
      await axios.patch(`/api/todos/${id}/toggle`);
      fetchTodos();
    } catch (error) {
      toast.error('Error updating status');
    }
  };

  const deleteTodo = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'var(--danger)',
      cancelButtonColor: 'var(--surface-border)',
      confirmButtonText: 'Yes, delete it!',
      background: 'var(--surface)',
      color: 'var(--text-main)',
      backdrop: 'rgba(0,0,0,0.4)'
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`/api/todos/${id}`);
        Swal.fire({
          title: 'Deleted!',
          text: 'Your task has been deleted.',
          icon: 'success',
          background: 'var(--surface)',
          color: 'var(--text-main)'
        });
        fetchTodos();
      } catch (error) {
        toast.error('Error deleting todo');
      }
    }
  };

  const editTodo = (todo) => {
    setEditingId(todo._id);
    setFormData({
      title: todo.title,
      description: todo.description,
      priority: todo.priority,
      category: todo.category,
      dueDate: todo.dueDate ? todo.dueDate.split('T')[0] : ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({ title: '', description: '', priority: 'medium', category: 'otro', dueDate: '' });
  };

  return (
    <>
      <Navbar />
      <div className="container">
        
        {/* Add/Edit Form */}
        <div className="glass-panel mb-4" style={{padding: '2rem'}}>
          <h2 className="text-gradient">{editingId ? 'Edit Task' : 'Add New Task'}</h2>
          <form onSubmit={handleSubmit} style={{display: 'flex', flexWrap: 'wrap', gap: '1rem'}}>
            <div style={{flex: '1 1 200px'}}>
              <input type="text" placeholder="Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
            </div>
            <div style={{flex: '2 1 300px'}}>
              <input type="text" placeholder="Description (optional)" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
            </div>
            <div style={{flex: '1 1 150px'}}>
              <select value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})}>
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
            </div>
            <div style={{flex: '1 1 150px'}}>
              <input type="text" placeholder="Category" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} />
            </div>
            <div style={{flex: '1 1 150px'}}>
              <input type="date" value={formData.dueDate} onChange={e => setFormData({...formData, dueDate: e.target.value})} />
            </div>
            <div style={{display: 'flex', gap: '0.5rem'}}>
              <button type="submit" className="btn btn-primary">
                {editingId ? 'Update' : <><Plus size={20}/> Add</>}
              </button>
              {editingId && <button type="button" onClick={resetForm} className="btn btn-secondary">Cancel</button>}
            </div>
          </form>
        </div>

        {/* Filters */}
        <div className="filters-bar">
          <select value={filterPriority} onChange={e => setFilterPriority(e.target.value)} style={{maxWidth: '200px'}}>
            <option value="">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <input type="text" placeholder="Filter by category" value={filterCategory} onChange={e => setFilterCategory(e.target.value)} style={{maxWidth: '200px'}} />
        </div>

        {/* Todos Grid */}
        {loading ? (
          <div className="text-center">Loading tasks...</div>
        ) : todos.length === 0 ? (
          <div className="text-center text-muted" style={{padding: '3rem'}}>No tasks found. Create one above!</div>
        ) : (
          <div className="todo-grid">
            {todos.map(todo => (
              <div key={todo._id} className={`glass-panel todo-card ${todo.completed ? 'completed' : ''}`}>
                <div className="todo-header">
                  <h3 style={{marginBottom: 0, paddingRight: '1rem', wordBreak: 'break-word'}}>{todo.title}</h3>
                  <button onClick={() => toggleTodo(todo._id)} style={{background: 'none', border: 'none', cursor: 'pointer', color: todo.completed ? 'var(--success)' : 'var(--text-muted)'}}>
                    {todo.completed ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                  </button>
                </div>
                
                <div className="todo-badges">
                  <span className={`badge badge-${todo.priority}`}>{todo.priority}</span>
                  <span className="badge badge-category">{todo.category}</span>
                </div>
                
                {todo.description && <p className="text-muted mb-4" style={{fontSize: '0.9rem'}}>{todo.description}</p>}
                
                {todo.dueDate && (
                  <p className="text-muted" style={{fontSize: '0.8rem'}}>Due: {new Date(todo.dueDate).toLocaleDateString()}</p>
                )}
                
                <div className="todo-actions">
                  <button onClick={() => editTodo(todo)} className="btn btn-secondary" style={{padding: '0.4rem', flex: 1}}>
                    <Edit2 size={16} /> Edit
                  </button>
                  <button onClick={() => deleteTodo(todo._id)} className="btn btn-danger" style={{padding: '0.4rem', flex: 1}}>
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
