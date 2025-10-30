'use client'

// 1. Import useActionState from 'react'
import { useActionState } from 'react'

// 2. Import your action AND the new State type
import { loginAction, type State } from './actions'

import Link from 'next/link'

export default function LoginPage() {
  // 3. Define the initial state for the form
  const initialState: State = { error: undefined }
  
  // 4. Call the useActionState hook
  // It returns the current state and the action to pass to the form
  const [state, formAction] = useActionState(loginAction, initialState)

  return (
    <div className="flex justify-center items-center h-screen">
      <form
        className="flex flex-col gap-4 p-8 border rounded shadow-lg"
        // 5. Use the new 'formAction'
        action={formAction}
        suppressHydrationWarning
      >
        <h1 className="text-xl font-bold">Login</h1>
        
        {/* 6. Display the error message if it exists */}
        {state.error && (
          <p className="text-sm text-red-500">{state.error}</p>
        )}

        <input name="email" type="email" placeholder="Email" required className="border p-2 rounded" />
        <input name="password" type="password" placeholder="Password" required className="border p-2 rounded" />
        <button type="submit" className="bg-blue-600 text-white p-2 rounded">Login</button>
        <button type='button' className="bg-blue-600 text-white p-2 rounded"><Link href="/register">Register</Link></button>
      </form>
    </div>
  )
}