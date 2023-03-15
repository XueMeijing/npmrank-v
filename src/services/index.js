import request from "../utils/request";
const BASE_URL = 'http://localhost:8080/'

// 获取排行类型
export async function getRankTypes () {
  const response = await fetch(BASE_URL + '/api/rank-types')
  let data = await response.clone().json()
  return data
}

// 获取排行类型
export async function getRankData ({params}) {
  const response = await fetch(BASE_URL + `/api/rank/${params.type}`)
  let data = await response.clone().json()
  return data
}