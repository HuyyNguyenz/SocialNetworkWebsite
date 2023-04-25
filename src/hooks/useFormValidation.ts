import { useState } from 'react'
import { MessageValidation, User } from '~/types'

const useFormValidation = (
  formData: User
): [
  messages: MessageValidation,
  handleValidation: (event: React.FocusEvent<HTMLInputElement, Element>) => void,
  disableValidation: (event: React.FocusEvent<HTMLInputElement, Element>) => void
] => {
  const [messages, setMessages] = useState<MessageValidation>({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    birthDay: ''
  })

  const handleValidation = (event: React.FocusEvent<HTMLInputElement, Element>) => {
    // eslint-disable-next-line no-useless-escape
    const regexEmail = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)
    const regexPassword = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{8,32}$/)
    const currentYear = new Date().getFullYear()
    const birthDayYear = Number(formData.birthDay.split('-')[0])

    switch (event.target.name) {
      case 'email':
        if (!formData.email.match(regexEmail)) {
          const errorMessage = formData.email === '' ? 'Email không được bỏ trống' : 'Email chưa chính xác!'
          setMessages((prev) => ({ ...prev, email: errorMessage }))
        } else {
          setMessages((prev) => ({ ...prev, email: '' }))
        }
        break
      case 'password':
        if (!formData.password.match(regexPassword)) {
          const errorMessage =
            formData.password === ''
              ? 'Mật khẩu không được bỏ trống'
              : 'Mật khẩu phải có ít nhất 8 ký tự, trong đó bao gồm ít nhất 1 ký tự in hoa, 1 ký tự thường, 1 số và 1 ký tự đặc biệt!'
          setMessages((prev) => ({
            ...prev,
            password: errorMessage
          }))
        } else {
          setMessages((prev) => ({ ...prev, password: '' }))
        }
        break
      case 'firstName':
        if (formData.firstName === '') {
          setMessages((prev) => ({ ...prev, firstName: 'Họ lót không được bỏ trống' }))
        } else {
          setMessages((prev) => ({ ...prev, firstName: '' }))
        }
        break
      case 'lastName':
        if (formData.lastName === '') {
          setMessages((prev) => ({ ...prev, lastName: 'Tên không được bỏ trống' }))
        } else {
          setMessages((prev) => ({ ...prev, lastName: '' }))
        }
        break
      case 'birthDay':
        if (formData.birthDay === '') {
          setMessages((prev) => ({ ...prev, birthDay: 'Ngày sinh không được để trống' }))
        } else {
          if (currentYear - birthDayYear < 16) {
            setMessages((prev) => ({ ...prev, birthDay: 'Bạn chưa đủ tuổi để vào mạng xã hội' }))
          } else {
            setMessages((prev) => ({ ...prev, birthDay: '' }))
          }
        }
        break
      default:
        break
    }
  }

  const disableValidation = (event: React.FocusEvent<HTMLInputElement, Element>) => {
    switch (event.target.name) {
      case 'email':
        setMessages((prev) => ({ ...prev, email: '' }))
        break
      case 'password':
        setMessages((prev) => ({ ...prev, password: '' }))
        break
      case 'firstName':
        setMessages((prev) => ({ ...prev, firstName: '' }))
        break
      case 'lastName':
        setMessages((prev) => ({ ...prev, lastName: '' }))
        break
      case 'birthDay':
        setMessages((prev) => ({ ...prev, birthDay: '' }))
        break
      default:
        break
    }
  }

  return [messages, handleValidation, disableValidation]
}

export default useFormValidation
