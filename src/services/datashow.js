/**
 * Created by guoguangyu on 2018/8/9.
 */
/* global API:true */
import { request } from 'utils'

export async function getPieDataInfo (body) {
	return request(`${API}/ticket/pieDataInfo`, {
		method: 'post',
		body,
	})
}
