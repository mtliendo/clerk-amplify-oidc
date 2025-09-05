import {
	SignedIn,
	SignedOut,
	SignInButton,
	useAuth,
	UserButton,
} from '@clerk/clerk-react'

import './App.css'
import { generateClient } from 'aws-amplify/api'
import type { Schema } from '../amplify/data/resource'
import { useEffect, useState } from 'react'

const client = generateClient<Schema>()

function App() {
	const { isSignedIn, getToken } = useAuth()
	const [todos, setTodos] = useState<Schema['Todo']['type'][]>([])

	useEffect(() => {
		async function getTodos() {
			if (isSignedIn) {
				const authToken = await getToken({ template: 'appsync' })
				console.log(authToken)
				const response = await client.models.Todo.list({
					authMode: 'oidc',
					authToken: authToken || '',
				})
				if (response.data) {
					const todos = response.data
					setTodos(todos)
				}
			}
		}
		getTodos()
	}, [isSignedIn, getToken])

	return (
		<>
			<header>
				<SignedOut>
					<SignInButton />
				</SignedOut>
				<SignedIn>
					<UserButton />
					{isSignedIn && <p>Signed in</p>}
					{todos.map((todo) => (
						<p key={todo.id}>{todo.content}</p>
					))}
				</SignedIn>
			</header>
		</>
	)
}

export default App
