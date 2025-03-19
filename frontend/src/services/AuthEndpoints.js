import { post } from './HelperEndpoints/ApiEndpoints'

function login(data) {
    console.log("Should be fetching data right now...")
    return post('/auth/signin', data)
}

export { login };