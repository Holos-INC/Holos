import { post } from './HelperEndpoints/ApiEnpoints'

function login(data) {
    return post('baseUser/signin', data)
}

export { login };