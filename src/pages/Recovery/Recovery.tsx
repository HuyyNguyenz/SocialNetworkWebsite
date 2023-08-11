import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import RecoveryForm from '~/components/RecoveryForm'
import LoginLayout from '~/layouts/LoginLayout'

export default function Recovery() {
  const [isRecovery] = useState<boolean>(!!sessionStorage.getItem('recovery'))
  const navigate = useNavigate()

  useEffect(() => {
    if (!isRecovery) {
      navigate('/login')
    }
  }, [isRecovery, navigate])

  return (
    <LoginLayout>
      <RecoveryForm />
    </LoginLayout>
  )
}
