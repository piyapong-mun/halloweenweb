'use server'

import { signIn } from '@/auth'
import { AuthError } from 'next-auth'

// 1. Define the shape of the state
export type State = {
  error?: string
}

// 2. Change the function signature to accept prevState
export async function loginAction(prevState: State, formData: FormData): Promise<State> {
  try {
    // This will redirect on success or throw an error on failure
    await signIn('credentials', formData)

    // This line should not be reached if login is successful (due to redirect)
    return {} 
  } catch (error) {
    // 3. Handle different types of errors
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { error: 'Invalid email or password.' }
        default:
          return { error: 'An authentication error occurred.' }
      }
    }
    
    // Handle other errors (e.g., database connection)
    return { error: 'An unknown error occurred. Please try again.' }
  }
}