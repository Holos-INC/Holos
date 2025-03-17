import { post } from './HelperEndpoints/ApiEndpoints'

function login(data) {
    return post('auth/signin', data)
}

export { login };