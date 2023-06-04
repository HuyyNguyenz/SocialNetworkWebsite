import { initializeApp } from 'firebase/app'
import { getDownloadURL, getStorage, ref, uploadBytes, deleteObject } from 'firebase/storage'
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
    const pathName = `${type}/${file.name + v4()}`
    const fileRef = ref(storage, pathName)
    const result = await uploadBytes(fileRef, file)
    const url = await getDownloadURL(result.ref)
    return { url, pathName }
  } catch (error: any) {
    throw error.response
  }
}

export const deleteFile = async (pathName: string) => {
  try {
    const fileRef = ref(storage, pathName)
    deleteObject(fileRef)
  } catch (error: any) {
    throw error.response
  }
}
