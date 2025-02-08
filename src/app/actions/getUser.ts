'use server'

interface User {
  id: number
  name: string
}

const getUser = async (baseUrl: string, id: number): Promise<User> => {
  const response = await fetch(`${baseUrl}/user?id=${id}`, {
    headers: { Accept: 'application/json' },
  })
  const user: User = await response.json()
  return user
}

export default getUser
