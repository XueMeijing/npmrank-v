// 获取排行类型
export async function getRankingTypes() {
  const response = await fetch('/api/ranking/types');
  let data = await response.clone().json();
  return data;
}

// 获取排行类型
export async function getRankingPackages({ params }) {
  const response = await fetch(`/api/ranking/packages/${params.type}`);
  let data = await response.clone().json();
  return data;
}
