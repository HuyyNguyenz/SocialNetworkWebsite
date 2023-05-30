import { initializeApp } from 'firebase/app'
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage'
import { v4 } from 'uuid'

const firebaseConfig = {
  apiKey: 'AIzaSyC9dH5QIrgtJMzBRBlKGHWlPjmYPXOkeL4',
  authDomain: 'social-technology.firebaseapp.com',
  projectId: 'social-technology',
  storageBucket: 'social-technology.appspot.com',
  messagingSenderId: '113556276183',
  appId: '1:113556276183:web:7c5f3b190fefd4f528c192'
}
const app = initializeApp(firebaseConfig)
const storage = getStorage(app)
export const uploadFile = async (file: File, type: string) => {
  try {
    const fileRef = ref(storage, `${type}/${file.name + v4()}`)
    const result = await uploadBytes(fileRef, file)
    const url = await getDownloadURL(result.ref)
    return url
  } catch (error: any) {
    throw error.response
  }
}
