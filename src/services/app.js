import { request } from 'utils'

export async function getUserInfo (body) {
    return request(`${SSOAPI}/api/v1/decodeUserByLogin`, {
        method: 'post',
        body,
    })
}
export async function validToken (body) {
	return request(`${SSOAPI}/verifyauth`, {
		method: 'post',
		body,
	})
}
export async function getDeparts (body) {
	return request(`${API}/api/ticket/getGroup`, {
		method: 'post',
		body,
	})
}
export async function classifyList (body) {
	return request(`${API}/ticket/classifyList`, {
		method: 'post',
		body,
	})
}
export async function tagListInfo (body) {
	return request(`${API}/ticket/tagListInfo`, {
		method: 'post',
		body,
	})
}
export async function userListInfo (body) {
	return request(`${API}/ticket/userListInfo`, {
		method: 'post',
		body,
	})
}
export async function getStatusListNumber (body) {
	return request(`${API}/ticket/getStatusListNumber`, {
		method: 'post',
		body,
	})
}
export async function userListMenuInfo (body) {
	return request(`${API}/ticket/userListMenuInfo`, {
		method: 'post',
		body,
	})
}