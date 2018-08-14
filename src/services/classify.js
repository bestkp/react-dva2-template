import { request } from 'utils'

export async function getTagsListInfo (body) {
	return request(`${API}/ticket/getTagsListInfo`, {
		method: 'post',
		body,
	})
}
export async function classifyAdd (body) {
	return request(`${API}/ticket/classify/add`, {
		method: 'post',
		body,
	})
}
export async function classifyEdit (body) {
	return request(`${API}/ticket/classify/edit`, {
		method: 'post',
		body,
	})
}
export async function updateTagEdit (body) {
	return request(`${API}/ticket/classify/updateTagEdit`, {
		method: 'post',
		body,
	})
}
export async function delTags (body) {
	return request(`${API}/ticket/classify/delTags`, {
		method: 'post',
		body,
	})
}

