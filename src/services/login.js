import { request } from 'utils'

export async function login (body) {
    return request(`${API}/common/auth/login`, {
        method: 'post',
        body,
    })
}
