import { useState, useEffect, useRef, useCallback } from 'react'
import socket from '~/socket'
import userImg from '~/assets/images/user.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faMicrophone,
  faMicrophoneSlash,
  faPhone,
  faPhoneSlash,
  faVideo,
  faVideoSlash
} from '@fortawesome/free-solid-svg-icons'
import { User } from '~/types'
import Peer from 'simple-peer'
import { useSelector } from 'react-redux'
import { RootState } from '~/store'

interface Props {
  caller: User | null
  userCalled: User | null
  canceled: (value: boolean) => void
}

export default function VideoCall(props: Props) {
  const { caller, userCalled } = props
  const userData = useSelector((state: RootState) => state.userData)
  const [isAccepted, setAccepted] = useState<boolean>(false)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [callerSignal, setCallerSignal] = useState<Peer.SignalData | null>(null)
  const peerRef = useRef<Peer.Instance | null>(null)
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)
  const localAvatar = useRef<HTMLImageElement>(null)
  const remoteAvatar = useRef<HTMLImageElement>(null)
  const [isShowCamera, setShowCamera] = useState<boolean>(true)
  const [localMiro, setLocalMicro] = useState<boolean>(true)
  const [remoteMicro, setRemoteMicro] = useState<boolean>(true)
  const [message, setMessage] = useState<string>('')

  const handleCallUser = useCallback(
    (id: number) => {
      const peer = new Peer({
        initiator: true,
        trickle: false,
        stream: stream as MediaStream
      })
      peer.on('signal', (data) => {
        socket.emit('callUser', {
          userToCall: id,
          signalData: data
        })
      })
      peer.on('stream', (stream) => {
        remoteVideoRef.current && (remoteVideoRef.current.srcObject = stream)
      })
      socket.on('callAccepted', (data) => {
        const { signal } = data
        peer.signal(signal)
        setAccepted(true)
      })
      peerRef.current = peer
    },
    [stream]
  )

  const handleAnswerCall = () => {
    setAccepted(true)
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream as MediaStream
    })
    peer.on('signal', (data) => {
      socket.emit('answerCall', { signal: data, to: caller?.id })
    })
    peer.on('stream', (stream) => {
      remoteVideoRef.current && (remoteVideoRef.current.srcObject = stream)
    })
    callerSignal && peer.signal(callerSignal)
    peerRef.current = peer
  }

  const handleSendCancelCall = () => {
    caller === null && socket.emit('cancelledCall', { from: userCalled })
    userCalled === null && socket.emit('cancelledCall', { from: caller })
    handleCallCanceled()
  }

  const handleCallCanceled = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
    }
    if (peerRef.current) {
      peerRef.current.destroy()
      peerRef.current = null
    }
    setAccepted(false)
    setCallerSignal(null)
    props.canceled(true)
  }, [stream, props])

  const handleToggleCamera = () => {
    setShowCamera(!isShowCamera)
    localAvatar.current?.classList.toggle('hidden')
    localVideoRef.current?.classList.toggle('hidden')
  }

  const handleToggleMicro = () => {
    setLocalMicro(!localMiro)
  }

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
      setStream(stream)
    })
  }, [])

  useEffect(() => {
    socket.on('receiveCallUser', (data) => {
      const { signalData } = data
      setCallerSignal(signalData)
      document.body.classList.add('overflow-hidden')
    })
    socket.on('receiveStatusCamera', (data) => {
      const { camera } = data
      if (camera) {
        remoteVideoRef.current?.classList.remove('hidden')
        remoteAvatar.current?.classList.add('hidden')
      } else {
        remoteVideoRef.current?.classList.add('hidden')
        remoteAvatar.current?.classList.remove('hidden')
      }
    })
    socket.on('receiveStatusMicro', (data) => {
      const { micro } = data
      micro ? setRemoteMicro(true) : setRemoteMicro(false)
    })
    socket.on('callEnded', () => {
      callerSignal === null ? setMessage('Người nhận không nghe máy') : handleCallCanceled()
    })
  }, [handleCallCanceled, callerSignal])

  useEffect(() => {
    userCalled && stream && handleCallUser(userCalled.id as number)
  }, [userCalled, stream, handleCallUser])

  useEffect(() => {
    isAccepted && stream && localVideoRef.current && (localVideoRef.current.srcObject = stream)
  }, [isAccepted, stream])

  useEffect(() => {
    isShowCamera
      ? caller === null && socket.emit('sendStatusCamera', { id: userCalled?.id, camera: true })
      : caller === null && socket.emit('sendStatusCamera', { id: userCalled?.id, camera: false })
    isShowCamera
      ? userCalled === null && socket.emit('sendStatusCamera', { id: caller?.id, camera: true })
      : userCalled === null && socket.emit('sendStatusCamera', { id: caller?.id, camera: false })
  }, [isShowCamera, caller, userCalled])

  useEffect(() => {
    localMiro
      ? caller === null && socket.emit('sendStatusMicro', { id: userCalled?.id, micro: true })
      : caller === null && socket.emit('sendStatusMicro', { id: userCalled?.id, micro: false })
    localMiro
      ? userCalled === null && socket.emit('sendStatusMicro', { id: caller?.id, micro: true })
      : userCalled === null && socket.emit('sendStatusMicro', { id: caller?.id, micro: false })
  }, [localMiro, caller, userCalled])

  useEffect(() => {
    if (message) {
      setAccepted(false)
      const setTimeOut = setTimeout(() => {
        props.canceled(true)
      }, 1000)
      return () => {
        clearTimeout(setTimeOut)
      }
    }
  }, [message, props])

  return (
    <>
      {/* Người nhận cuộc gọi */}
      {caller && callerSignal && (
        <>
          <div
            className={`animate-fade text-center center fixed ${
              isAccepted ? 'w-full h-full' : 'w-[48rem] h-[80%]'
            } z-[60] bg-bg-light dark:bg-bg-dark rounded-md border border-solid border-border-color dark:border-dark-border-color overflow-hidden`}
          >
            {isAccepted && (
              <>
                <div className='flex flex-col items-start justify-start'>
                  <div className='relative self-end mb-2'>
                    <video className='h-40' ref={localVideoRef} autoPlay muted>
                      <track kind='captions' srcLang='en' label='English' />
                    </video>
                    <img
                      loading='lazy'
                      ref={localAvatar}
                      className='hidden h-40 w-[13.5rem] object-cover'
                      src={userData.avatar ? userData.avatar.url : userImg}
                      alt={userData.firstName + ' ' + userData.lastName}
                    />
                    <div className='absolute bottom-0 right-0 flex items-center justify-start text-14 text-white bg-black'>
                      {localMiro ? null : <FontAwesomeIcon className='text-red-600 px-2' icon={faMicrophoneSlash} />}
                      <span className='px-2'>Bạn</span>
                    </div>
                  </div>

                  <div className='relative self-center'>
                    <video className='h-[28.125rem]' ref={remoteVideoRef} autoPlay muted={remoteMicro ? false : true}>
                      <track kind='captions' srcLang='en' label='English' />
                    </video>
                    <img
                      loading='lazy'
                      ref={remoteAvatar}
                      className='hidden h-[28.125rem] w-[37.5rem] object-cover'
                      src={caller.avatar ? caller.avatar.url : userImg}
                      alt={caller.firstName + ' ' + caller.lastName}
                    />
                    <div className='absolute bottom-0 right-0 flex items-center justify-start text-14 text-white bg-black'>
                      {remoteMicro ? null : <FontAwesomeIcon className='text-red-600 px-2' icon={faMicrophoneSlash} />}
                      <span className='px-2'>{caller.firstName + ' ' + caller.lastName}</span>
                    </div>
                  </div>
                </div>

                <div className='mt-2'>
                  <button
                    onClick={handleSendCancelCall}
                    className='bg-red-600 w-14 h-14 text-white rounded-full hover:opacity-80 mx-4'
                  >
                    <FontAwesomeIcon icon={faPhoneSlash} />
                  </button>
                  <button
                    onClick={handleToggleCamera}
                    className='bg-dark-hover-color w-14 h-14 text-white rounded-full hover:opacity-80 mx-4'
                  >
                    {isShowCamera ? <FontAwesomeIcon icon={faVideo} /> : <FontAwesomeIcon icon={faVideoSlash} />}
                  </button>
                  <button
                    onClick={handleToggleMicro}
                    className='bg-dark-hover-color w-14 h-14 text-white rounded-full hover:opacity-80 mx-4'
                  >
                    {localMiro ? <FontAwesomeIcon icon={faMicrophone} /> : <FontAwesomeIcon icon={faMicrophoneSlash} />}
                  </button>
                </div>
              </>
            )}

            {!isAccepted && (
              <div className='center'>
                <img
                  loading='lazy'
                  className='w-52 h-52 object-cover rounded-md my-0 mx-auto'
                  src={caller.avatar ? caller.avatar.url : userImg}
                  alt={caller.firstName + ' ' + caller.lastName}
                />
                <div className='text-18 font-bold text-title-color dark:text-dark-title-color'>
                  <h3 className='my-6'>{caller.firstName + ' ' + caller.lastName}</h3>
                  <div className='flex items-center justify-between'>
                    <button
                      onClick={handleAnswerCall}
                      className='animate-bounce bg-green-600 w-14 h-14 text-white rounded-full hover:opacity-80'
                    >
                      <FontAwesomeIcon icon={faPhone} />
                    </button>
                    <button
                      onClick={handleSendCancelCall}
                      className='bg-red-600 w-14 h-14 text-white rounded-full hover:opacity-80'
                    >
                      <FontAwesomeIcon icon={faPhoneSlash} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className='overlay' />
        </>
      )}

      {/* Người gọi */}
      {userCalled && callerSignal === null && (
        <>
          <div
            className={`animate-fade text-center center fixed ${
              isAccepted ? 'w-full h-full' : 'w-[48rem] h-[80%]'
            } z-[60] bg-bg-light dark:bg-bg-dark rounded-md border border-solid border-border-color dark:border-dark-border-color overflow-hidden`}
          >
            {isAccepted && (
              <>
                <div className='flex flex-col items-start justify-start'>
                  <div className='relative self-end mb-2'>
                    <video className='h-40' ref={localVideoRef} autoPlay muted>
                      <track kind='captions' srcLang='en' label='English' />
                    </video>
                    <img
                      loading='lazy'
                      ref={localAvatar}
                      className='hidden h-40 w-[13.5rem] object-cover'
                      src={userData.avatar ? userData.avatar.url : userImg}
                      alt={userData.firstName + ' ' + userData.lastName}
                    />
                    <div className='absolute bottom-0 right-0 flex items-center justify-start text-14 text-white bg-black'>
                      {localMiro ? null : <FontAwesomeIcon className='text-red-600 px-2' icon={faMicrophoneSlash} />}
                      <span className='px-2'>Bạn</span>
                    </div>
                  </div>

                  <div className='relative self-center'>
                    <video className='h-[28.125rem]' ref={remoteVideoRef} autoPlay muted={remoteMicro ? false : true}>
                      <track kind='captions' srcLang='en' label='English' />
                    </video>
                    <img
                      loading='lazy'
                      ref={remoteAvatar}
                      className='hidden h-[28.125rem] w-[37.5rem] object-cover'
                      src={userCalled.avatar ? userCalled.avatar.url : userImg}
                      alt={userCalled.firstName + ' ' + userCalled.lastName}
                    />
                    <div className='absolute bottom-0 right-0 flex items-center justify-start text-14 text-white bg-black'>
                      {remoteMicro ? null : <FontAwesomeIcon className='text-red-600 px-2' icon={faMicrophoneSlash} />}
                      <span className='px-2'>{userCalled.firstName + ' ' + userCalled.lastName}</span>
                    </div>
                  </div>
                </div>

                <div className='mt-2'>
                  <button
                    onClick={handleSendCancelCall}
                    className='bg-red-600 w-14 h-14 text-white rounded-full hover:opacity-80 mx-4'
                  >
                    <FontAwesomeIcon icon={faPhoneSlash} />
                  </button>
                  <button
                    onClick={handleToggleCamera}
                    className='bg-dark-hover-color w-14 h-14 text-white rounded-full hover:opacity-80 mx-4'
                  >
                    {isShowCamera ? <FontAwesomeIcon icon={faVideo} /> : <FontAwesomeIcon icon={faVideoSlash} />}
                  </button>
                  <button
                    onClick={handleToggleMicro}
                    className='bg-dark-hover-color w-14 h-14 text-white rounded-full hover:opacity-80 mx-4'
                  >
                    {localMiro ? <FontAwesomeIcon icon={faMicrophone} /> : <FontAwesomeIcon icon={faMicrophoneSlash} />}
                  </button>
                </div>
              </>
            )}

            {!isAccepted && (
              <div className='center'>
                <img
                  loading='lazy'
                  className='w-52 h-52 object-cover rounded-md my-0 mx-auto'
                  src={userCalled.avatar ? userCalled.avatar.url : userImg}
                  alt={userCalled.firstName + ' ' + userCalled.lastName}
                />
                <div className='text-18 font-bold text-title-color dark:text-dark-title-color'>
                  <h3 className='my-6'>{userCalled.firstName + ' ' + userCalled.lastName}</h3>
                  <div className='flex flex-col items-center justify-between'>
                    <span className='mb-4'>{message ? message : 'Đang gọi ...'}</span>
                    <button
                      onClick={handleSendCancelCall}
                      className='bg-red-600 w-14 h-14 text-white rounded-full hover:opacity-80'
                    >
                      <FontAwesomeIcon icon={faPhoneSlash} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className='overlay' />
        </>
      )}
    </>
  )
}
