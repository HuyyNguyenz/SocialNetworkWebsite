import axios, { AxiosInstance } from 'axios'

class Http {
  instance: AxiosInstance
  constructor() {
    this.instance = axios.create({
      baseURL: 'http://localhost:3001/api/',
      timeout: 10000
    })
  }
  get = (url: string) => this.instance.get(url)
  post = (url: string, body: object) => this.instance.post(url, body)
  put = (url: string, id: string, body: object) => this.instance.post(`${url}/${id}`, body)
}

const fetchApi = new Http().instance

export default fetchApi
