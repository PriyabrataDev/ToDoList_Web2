import { useState } from 'react'
import './App.css'

const filters = ['All', 'Active', 'Completed']

function App() {
  const [tasks, setTasks] = useState([])
  const [newTask, setNewTask] = useState('')
  const [filter, setFilter] = useState('All')
  const [editingId, setEditingId] = useState(null)
  const [editText, setEditText] = useState('')

  const completedCount = tasks.filter((task) => task.completed).length
  const activeCount = tasks.length - completedCount
  const progress = tasks.length === 0 ? 0 : Math.round((completedCount / tasks.length) * 100)
  const visibleTasks = tasks.filter((task) => {
    if (filter === 'Active') return !task.completed
    if (filter === 'Completed') return task.completed
    return true
  })

  function addTask(event) {
    event.preventDefault()
    const name = newTask.trim()
    if (!name) return

    setTasks((currentTasks) => [
      { id: `${Date.now()}-${Math.random()}`, name, completed: false },
      ...currentTasks,
    ])
    setNewTask('')
  }

  function toggleTask(id) {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    )
  }

  function removeTask(id) {
    setTasks((currentTasks) => currentTasks.filter((task) => task.id !== id))
    if (editingId === id) setEditingId(null)
  }

  function startEditing(task) {
    setEditingId(task.id)
    setEditText(task.name)
  }

  function saveEdit(event, id) {
    event.preventDefault()
    const name = editText.trim()
    if (!name) return

    setTasks((currentTasks) =>
      currentTasks.map((task) => task.id === id ? { ...task, name } : task),
    )
    setEditingId(null)
  }

  function cancelEdit() {
    setEditingId(null)
    setEditText('')
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="Sprocket home">
          <img className="brand-mark" src="/sprocket.svg" alt="" />
          <span>Sprocket</span>
        </a>
        <p className="topbar-note"><span /> A little more present</p>
        <p className="date">{new Intl.DateTimeFormat('en', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
        }).format(new Date())}</p>
      </header>

      <div className="dashboard">
        <section className="welcome-panel" aria-labelledby="welcome-title">
          <div className="welcome-copy">
            <p className="eyebrow"><span /> A fresh page</p>
            <h1 id="welcome-title">Make room<br />for <span>what matters.</span></h1>
            <p className="welcome-description">
              A calm little corner for the things you want to get done — at your own pace.
            </p>
          </div>

          <div className="reminder-card">
            <div className="reminder-heading">
              <span className="reminder-spark" aria-hidden="true">✳</span>
              <span>A note to self</span>
            </div>
            <p>Progress is a rhythm,<br />not a race.</p>
            <span className="reminder-index">01 / TAKE IT EASY</span>
          </div>

          <div className="welcome-footer">
            <span className="footer-mark" aria-hidden="true"><span /></span>
            <span>Small steps make lovely days.</span>
          </div>
        </section>

        <section className="task-section" aria-label="Task list">
          <div className="task-heading">
            <div>
              <p className="section-kicker">Your day, at a glance</p>
              <h2>Today’s list</h2>
            </div>
            <span className="completed-badge">
              <span className="badge-check" aria-hidden="true">✓</span>
              {completedCount} done
            </span>
          </div>

          <form className="task-form" onSubmit={addTask}>
            <label className="visually-hidden" htmlFor="new-task">Add a task</label>
            <input
              id="new-task"
              type="text"
              value={newTask}
              onChange={(event) => setNewTask(event.target.value)}
              placeholder="What would you like to do?"
              maxLength={120}
            />
            <button type="submit" disabled={!newTask.trim()}>
              <span aria-hidden="true">+</span>
              Add task
            </button>
          </form>

          <div className="list-summary">
            <span className="tasks-left">
              <strong>{activeCount}</strong> {activeCount === 1 ? 'thing' : 'things'} on your plate
            </span>
            <div className="filters" role="group" aria-label="Filter tasks">
              {filters.map((option) => (
                <button
                  key={option}
                  type="button"
                  className={filter === option ? 'filter active' : 'filter'}
                  aria-pressed={filter === option}
                  onClick={() => setFilter(option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {tasks.length > 0 && (
            <div className="progress-summary">
              <div className="progress-track" role="progressbar" aria-label="Task completion" aria-valuenow={progress} aria-valuemin="0" aria-valuemax="100">
                <span style={{ width: `${progress}%` }} />
              </div>
              <span>{completedCount} of {tasks.length} done</span>
            </div>
          )}

          {visibleTasks.length > 0 ? (
            <ul className="task-list" aria-live="polite">
              {visibleTasks.map((task) => (
                <li className={task.completed ? 'task completed' : 'task'} key={task.id}>
                  {editingId === task.id ? (
                    <form className="edit-form" onSubmit={(event) => saveEdit(event, task.id)}>
                      <input
                        type="text"
                        aria-label="Edit task"
                        value={editText}
                        maxLength={120}
                        autoFocus
                        onChange={(event) => setEditText(event.target.value)}
                        onKeyDown={(event) => {
                          if (event.key === 'Escape') cancelEdit()
                        }}
                      />
                      <button type="submit" disabled={!editText.trim()}>Save</button>
                      <button type="button" className="cancel-button" onClick={cancelEdit}>Cancel</button>
                    </form>
                  ) : (
                    <>
                      <label className="task-label">
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => toggleTask(task.id)}
                        />
                        <span>{task.name}</span>
                      </label>
                      <div className="task-actions">
                        <button
                          type="button"
                          className="edit-button"
                          aria-label={`Edit ${task.name}`}
                          onClick={() => startEditing(task)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="delete-button"
                          aria-label={`Delete ${task.name}`}
                          onClick={() => removeTask(task.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <div className="empty-state">
              <span className="empty-illustration" aria-hidden="true">
                <span />
                <span />
                <span />
              </span>
              <p className="empty-title">
                {tasks.length === 0
                  ? 'Room to begin'
                  : filter === 'Active'
                    ? 'Nothing left to do'
                    : 'Not quite there yet'}
              </p>
              <p className="empty-message">
                {tasks.length === 0
                  ? 'Add one small thing and take it from there.'
                  : filter === 'Active'
                    ? 'You’ve made it through your list.'
                    : 'Your finished tasks will find a home here.'}
              </p>
            </div>
          )}

          {completedCount > 0 && (
            <button
              className="clear-button"
              type="button"
              onClick={() => setTasks((currentTasks) => currentTasks.filter((task) => !task.completed))}
            >
              Clear completed tasks
            </button>
          )}
        </section>
      </div>
    </main>
  )
}

export default App
