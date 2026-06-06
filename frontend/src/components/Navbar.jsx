// frontend/src/components/Navbar.jsx
import { signOut } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import { auth } from '../services/firebase'
import { LogOut, Code2 } from 'lucide-react'

export default function Navbar({ user, role }) {
  const navigate = useNavigate()

  async function handleLogout() {
    await signOut(auth)
    navigate('/login')
  }

  return (
    <nav className='bg-white border-b border-gray-200 px-6 py-3
                    flex items-center justify-between sticky top-0 z-50'>
      {/* Logo */}
      <div className='flex items-center gap-2'>
        <Code2 className='text-blue-600' size={22} />
        <span className='font-bold text-blue-700 text-lg'>CodeLab</span>
        <span className='ml-3 text-xs bg-blue-100 text-blue-700 px-2 py-0.5
                         rounded-full font-medium capitalize'>
          {role}
        </span>
      </div>

      {/* Right side */}
      <div className='flex items-center gap-4'>
        <span className='text-sm text-gray-500 hidden sm:block'>
          {user?.email}
        </span>
        <button
          onClick={handleLogout}
          className='flex items-center gap-1.5 text-sm text-gray-600
                     hover:text-red-600 transition-colors'
        >
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </nav>
  )
}