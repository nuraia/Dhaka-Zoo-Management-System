import AuthForm from '../components/AuthForm.jsx'

function AuthPage({ mode }) {
  const isRegister = mode === 'register'

  return (
    <main className="auth-page">
      <section className="auth-panel">
        <span className="eyebrow">{isRegister ? 'Visitor account' : 'Welcome back'}</span>
        <h1>{isRegister ? 'Create your visitor account' : 'Sign in to book tickets'}</h1>
        <p>
          {isRegister
            ? 'Register once, then book tickets and keep your visit history in one place.'
            : 'Ticket booking is protected so every reservation is connected to a visitor record.'}
        </p>
        <AuthForm mode={mode} />
      </section>
      <aside className="auth-aside">
        <h2>What your account unlocks</h2>
        <ul>
          <li>Ticket booking with a unique validation code.</li>
          <li>Saved ticket history for future visits.</li>
          <li>Future day planner and ZooBot features.</li>
        </ul>
      </aside>
    </main>
  )
}

export default AuthPage
