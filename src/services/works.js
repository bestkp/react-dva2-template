import { request } from 'utils'

export async function getWorksDetail (body) {
	return request(`${API}/ticket/trickDetailInfo`, {
		method: 'post',
		body,
	})
}

export async function getReplyList (body) {
	return request(`${API}/ticket/replayList`, {
		method: 'post',
		body,
	})
}
export async function getReminderReplay (body) {
	return request(`${API}/ticket/reminderReplay`, {
		method: 'post',
		body,
	})
}
export async function getWorksList (body) {
	return request(`${API}/ticket/trickLists`, {
		method: 'post',
		body,
	})
}
export async function receiveTrick (body) {
	return request(`${API}/ticket/receiveTrick`, {
		method: 'post',
		body,
	})
}
export async function rejectWorkOrder (body) {
	return request(`${API}/ticket/rejectWorkOrder`, {
		method: 'post',
		body,
	})
}
export async function issuedUpdateOrder (body) {
	return request(`${API}/ticket/issuedUpdateOrder`, {
		method: 'post',
		body,
	})
}
export async function finshTrick (body) {
	return request(`${API}/ticket/finshTrick`, {
		method: 'post',
		body,
	})
}
export async function startOncallJob (body) {
	return request(`${API}/ticket/startOncallJob`, {
		method: 'post',
		body,
	})
}
export async function exportTrickList (body) {
	return request(`${API}/ticket/exportTrickList`, {
		method: 'post',
		body,
	})
}
export async function batches (body) {
	return request(`${API}/ticket/batches`, {
		method: 'post',
		body,
	})
}

