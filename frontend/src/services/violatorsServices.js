import axios from 'axios'
const baseUrl = 'http://localhost:3001/ndzviolations'

//a simple function to retrieve the data from backend
const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
  }
  // eslint-disable-next-line
  export default {getAll}